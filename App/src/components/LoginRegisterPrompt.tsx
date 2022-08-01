import react, { } from 'react';
import logo from '../logo.png';
import { Button, SimpleGrid } from '@mantine/core';
import { Link } from 'react-router-dom';
import './LoginRegisterPrompt.css';



export default function LoginRegisterPrompt() {
    return (
        <div className="LoginRegisterPrompt">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="App-topic">
                <h1>FresHair</h1>
            </div>
            {/* <div className="grid-outer-container"> */}
            <div>
                <SimpleGrid cols={1} className="login-register-grid">
                    <div className="description">
                        <div className="greeting-line">
                            Welcome
                        </div>
                        <div className="login-register-line">
                            請先登入或註冊，以使用更多服務。
                        </div>
                    </div>
                    <div className="login-register-box">
                        <Link to="/login">
                            <Button className="login-button">
                                登入
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="register-button">
                                註冊
                            </Button>
                        </Link>
                    </div>
                </SimpleGrid>
            </div>
        </div>
    )
}