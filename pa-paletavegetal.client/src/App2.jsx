import React, { useState } from 'react';
import { DesktopOutlined, PieChartOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Typography, Space, Divider } from 'antd';
const { Text, Link } = Typography;
// Importamos tus nuevas pantallas
import Especies from './Especies';
import EstimacionRiego from './EstimacionRiego';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return { key, icon, children, label };
}

const items = [
    getItem('Especies', '1', <PieChartOutlined />),
    getItem('Estimacion de riego', '2', <DesktopOutlined />),
    // getItem('Team', 'sub2', <TeamOutlined />, [
    //     getItem('Team 1', '6'),
    //     getItem('Team 2', '8')
    // ]),
];

const App = () => {
    const [collapsed, setCollapsed] = useState(false);

    // ESTE ES EL SECRETO: Una variable que guarda en qué menú estamos
    const [vistaActiva, setVistaActiva] = useState('1');

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    // Cuando damos clic, actualizamos la vista activa
                    onClick={(e) => setVistaActiva(e.key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />

                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Manuel' }]} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {/* AQUÍ DECIDIMOS QUÉ MOSTRAR */}
                        {vistaActiva === '1' && <Especies />}
                        {vistaActiva === '2' && <EstimacionRiego />}
                        {vistaActiva === '6' && <h2>Pantalla de Team 1</h2>}

                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    <div>PaletaVegetal ©{new Date().getFullYear()} Created by MAHN</div>
                    <Divider style={{ margin: '12px 0' }} />
                    <Space split={<Divider type="vertical" />}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Información técnica recolectada de la <strong>Paleta Vegetal de Hermosillo</strong>
                        </Text>
                        <Link 
                            href="https://www.implanhermosillo.gob.mx/" 
                            target="_blank" 
                            style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}
                        >
                            <GlobalOutlined style={{ marginRight: '4px' }} /> IMPLAN Hermosillo
                        </Link>
                    </Space>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;
