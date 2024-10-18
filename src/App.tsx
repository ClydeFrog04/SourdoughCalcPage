import "./App.scss";
import "./index.css";
import {Route, Routes} from "react-router-dom";
import SourdoughCalcPage from "./pages/SourdoughCalcPage/SourdoughCalcPage.tsx";

function App() {

    return (
        <>
            <div className="App">
                <Routes>
                    <Route
                        path={"/"}
                        element={
                        <SourdoughCalcPage/>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
