import React from 'react';
import { useLocation } from 'react-router';
import './NotMatchPage.css';

export default function NotMatchPage() {
    const location = useLocation()
    return (
            <div className="notMatch">
                <h2>404 Not Found</h2>
                <div className="message">
                    <div>The content you trying to find does not exist.</div>
                    <div>You are at: &nbsp;<span>{location.pathname}</span></div>
                    {/* <div>{location.search}</div> */}
                </div>
            </div>
    )
}