
function ShowPopup({content, contentType}){

return (<div style={contentType==='info' ? null : {backgroundColor:"#ff00002e"}} className='popup-container'>
    <h4>{content}</h4>
</div>)
}
export default ShowPopup;