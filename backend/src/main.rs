mod page;

use actix_files::{Files, NamedFile};
use actix_web::dev::{fn_service, ServiceRequest, ServiceResponse};
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use std::path::PathBuf;

const BIND: &str = "127.0.0.1:8787";

fn dist_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("frontend")
        .join("dist")
}

#[get("/api/pages")]
async fn list_pages() -> impl Responder {
    match page::load_all(&page::content_dir()) {
        Ok(pages) => HttpResponse::Ok().json(pages),
        Err(e) => {
            eprintln!("list_pages: {e:?}");
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[get("/api/pages/{slug}")]
async fn get_page(slug: web::Path<String>) -> impl Responder {
    match page::load_one(&page::content_dir(), &slug) {
        Ok(p) => HttpResponse::Ok().json(p),
        Err(page::PageError::NotFound) => HttpResponse::NotFound().finish(),
        Err(e) => {
            eprintln!("get_page({slug}): {e:?}");
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[get("/p/{slug}")]
async fn page_html(slug: web::Path<String>) -> actix_web::Result<NamedFile> {
    if slug.contains('/') || slug.contains("..") || slug.is_empty() {
        return Err(actix_web::error::ErrorNotFound(""));
    }
    let prerendered = dist_dir().join("p").join(slug.as_str()).join("index.html");
    let fallback = dist_dir().join("index.html");
    let path = if prerendered.is_file() { prerendered } else { fallback };
    Ok(NamedFile::open_async(&path).await?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let dist = dist_dir();
    println!("serving {} on http://{BIND}", dist.display());

    HttpServer::new(move || {
        let index = dist.join("index.html");
        App::new()
            .service(list_pages)
            .service(get_page)
            .service(page_html)
            .service(
                Files::new("/", &dist)
                    .index_file("index.html")
                    .default_handler(fn_service(move |req: ServiceRequest| {
                        let index = index.clone();
                        async move {
                            let (req, _) = req.into_parts();
                            let file = NamedFile::open_async(&index).await?;
                            let res = file.into_response(&req);
                            Ok(ServiceResponse::new(req, res))
                        }
                    })),
            )
    })
    .bind(BIND)?
    .run()
    .await
}
