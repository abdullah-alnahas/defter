use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Frontmatter {
    pub title: String,
    pub lang: String,
    pub dir: String,
    pub date: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct PageMeta {
    pub slug: String,
    #[serde(flatten)]
    pub fm: Frontmatter,
}

#[derive(Debug, Serialize)]
pub struct Page {
    #[serde(flatten)]
    pub meta: PageMeta,
    pub body: String,
}

#[derive(Debug)]
#[allow(dead_code)]
pub enum PageError {
    Io(io::Error),
    Toml(toml::de::Error),
    Malformed,
    NotFound,
}

impl From<io::Error> for PageError {
    fn from(e: io::Error) -> Self {
        if e.kind() == io::ErrorKind::NotFound {
            PageError::NotFound
        } else {
            PageError::Io(e)
        }
    }
}

impl From<toml::de::Error> for PageError {
    fn from(e: toml::de::Error) -> Self { PageError::Toml(e) }
}

const DELIM: &str = "+++";

fn split_frontmatter(src: &str) -> Result<(&str, &str), PageError> {
    let rest = src.strip_prefix(DELIM).ok_or(PageError::Malformed)?;
    let rest = rest.strip_prefix('\n').ok_or(PageError::Malformed)?;
    let close = rest.find(&format!("\n{DELIM}")).ok_or(PageError::Malformed)?;
    let fm = &rest[..close];
    let body = rest[close + 1 + DELIM.len()..].trim_start_matches('\n');
    Ok((fm, body))
}

fn parse(slug: String, src: &str) -> Result<Page, PageError> {
    let (fm_src, body) = split_frontmatter(src)?;
    let fm: Frontmatter = toml::from_str(fm_src)?;
    Ok(Page {
        meta: PageMeta { slug, fm },
        body: body.to_string(),
    })
}

pub fn load_one(dir: &Path, slug: &str) -> Result<Page, PageError> {
    if slug.contains('/') || slug.contains("..") || slug.is_empty() {
        return Err(PageError::NotFound);
    }
    let path = dir.join(format!("{slug}.md"));
    let src = fs::read_to_string(path)?;
    parse(slug.to_string(), &src)
}

pub fn load_all(dir: &Path) -> Result<Vec<PageMeta>, PageError> {
    let mut out = Vec::new();
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.extension().and_then(|s| s.to_str()) != Some("md") { continue; }
        let slug = match path.file_stem().and_then(|s| s.to_str()) {
            Some(s) => s.to_string(),
            None => continue,
        };
        let src = fs::read_to_string(&path)?;
        let page = parse(slug, &src)?;
        out.push(page.meta);
    }
    out.sort_by(|a, b| b.fm.date.cmp(&a.fm.date));
    Ok(out)
}

pub fn content_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("content")
}
