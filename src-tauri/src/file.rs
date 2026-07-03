use serde::{Deserialize, Serialize};


#[derive(Deserialize,Serialize,Debug)]
pub struct PreviewData {
    pub page_id: String,
    pub data: Vec<u8>,
}

#[derive(Deserialize, Debug)]
pub struct SaveProjectRequest {
    pub path: String,
    pub project: String,
    pub previews: Vec<PreviewData>,
}

#[derive(Serialize, Debug)]
pub struct LoadProjectResponse {
    pub project: String,
    pub previews: Vec<PreviewData>,
}

#[tauri::command]
pub fn save_project(request: SaveProjectRequest) -> Result<(), String> {
    dbg!(&request);
    // write file...
    Ok(())
}

#[tauri::command]
pub fn load_project(path: String) -> Result<LoadProjectResponse, String> {
    // read file...
    Ok(LoadProjectResponse {
        project: String::new(),
        previews: Vec::new(),
    })
}