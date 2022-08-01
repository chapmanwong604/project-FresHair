import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
// import TabBar from './components/TabBar';
import NotMatchPage from './pages/NotMatchPage'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import SettingsPage from './pages/SettingsPage';
import FindHairStylistsPage from './pages/FindHairStylistsPage';
import ServicePlanNewPage from './components/ServicePlanNew';
import Register from './pages/RegisterPage';
import HairStylistDetailsPage from './pages/HairStylistDetailsPage';
import TimeTablePage from './pages/TimeTablePage'
import ClientBookingRequestComponent from './pages/ClientBookingRequestComponent';



export const routes = {
    login: '/login',
    home: '/home',
    findHairStylists: '/find-hair-stylists',
    bookings: '/bookings/',
    settings:'/settings',
    test:'/test',
    servicePlan:"/service-plan",
    register: '/register',
    hairStylistDetailsPage: '/hair-stylist-details/:id',
    timeTable: '/timetable',
    requestBooking:'/requestBooking/:id'
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Navigate to={routes.home} />} />
            <Route path={routes.register} element={<Register />} />
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.home} element={<HomePage />} />
            <Route path={routes.findHairStylists} element={<FindHairStylistsPage />} />
            <Route path={routes.bookings} element={<BookingsPage />} />
            <Route path={routes.settings} element={<SettingsPage />} />
            <Route path={routes.servicePlan} element={<ServicePlanNewPage />} />
            <Route path={routes.hairStylistDetailsPage} element={<HairStylistDetailsPage />} />
            <Route path={routes.timeTable} element={<TimeTablePage />} />
            <Route path={routes.requestBooking} element={<ClientBookingRequestComponent />} />
            <Route path='*' element={<NotMatchPage />} />
        </Routes>
    )
}