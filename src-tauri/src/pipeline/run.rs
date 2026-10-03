use crate::file::preparation::change_application_id;
pub async fn try_run_project(){
    println!("start run");
    change_application_id("/omg/","test", "new_application");
}