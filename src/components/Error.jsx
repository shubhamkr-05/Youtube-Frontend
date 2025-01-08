import { useNavigate } from "react-router-dom"
function ShowError() {
    const navigate = useNavigate()
    alert("Sorry, there was an error");

    setTimeout(() => {
        navigate("/");
    }, 1000);
}


export default ShowError
