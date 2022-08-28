import * as React from 'react';
import {NotificationContainer} from "../adapters/notificationAdapter";
import {Provider} from 'react-redux';
import {store} from "../redux/store";

import "../styles/App.scss";
import 'react-toastify/dist/ReactToastify.min.css';

import AppContainer from "./AppContainer";
import ProductListScene from "./scenes/ProductListScene";
import SettingsScene from "./scenes/SettingsScene";
import ControlMenu from "./ControlMenu";
import ModalBackground from "./commons/Modal/ModalBackground";
import ConfirmOrderModal from "./modals/ConfirmOrderModal";
import OrderThankyouModal from "./modals/OrderThankyouModal";
import CategoriesSideMenu from "./sideMenus/CategoriesSideMenu";

function App() {
    return (
            <Provider store={store}>
                <AppContainer>
                    <ProductListScene activate={true}/>
                    <SettingsScene/>
                    <ControlMenu/>

                    <CategoriesSideMenu/>

                    <ModalBackground/>
                    <ConfirmOrderModal/>
                    <OrderThankyouModal/>
                </AppContainer>

                <NotificationContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                />
            </Provider>
    );
}

export default App;