import Login from "../../components/login/login";
import Register from "../../components/register/register";
import './authentication.component.css'
const Authentication = () =>{
return(
    <div className="window">
    <Register/>
    <Login/>
    </div>
)
}

export default Authentication;