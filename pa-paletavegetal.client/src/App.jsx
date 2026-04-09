import { useEffect, useState } from 'react';
//import './App.css';
import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';


const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 2. Estados de React para controlar la ventana
    const [collapsed, setCollapsed] = useState(false);
    const [forecasts, setForecasts] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [registroEditando, setRegistroEditando] = useState(null);

    // 3. Control del formulario
    const [form] = Form.useForm();

    

    // 4. Funciones de red (Cargar datos)
    async function populateWeatherData() {
        const response = await fetch('api/vegetacion');
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }
    useEffect(() => {
        populateWeatherData();
    }, []);

    // 5. Control de la ventana flotante (Modal)
    const abrirModalAgregar = () => {
        setRegistroEditando(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const abrirModalEditar = (record) => {
        setRegistroEditando(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleCancelar = () => {
        setIsModalVisible(false);
    };

    // 6. Lógica de Guardar y Eliminar
    const handleGuardar = async () => {
        try {
            const valores = await form.validateFields();

            const url = registroEditando ? `api/vegetacion/${registroEditando.id}` : 'api/vegetacion';
            const metodo = registroEditando ? 'PUT' : 'POST';

            const cuerpoPeticion = registroEditando
                ? { ...valores, id: registroEditando.id }
                : valores;

            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpoPeticion)
            });

            if (response.ok) {
                message.success(`Vegetación ${registroEditando ? 'actualizada' : 'agregada'} correctamente`);
                setIsModalVisible(false);
                populateWeatherData();
            } else {
                message.error('Hubo un error al guardar los datos');
            }
        } catch (errorInfo) {
            console.log('Error:', errorInfo);
        }
    };

    const handleEliminar = async (id) => {
        try {
            const response = await fetch(`api/vegetacion/${id}`, { method: 'DELETE' });

            if (response.ok) {
                message.success('Registro eliminado correctamente');
                populateWeatherData();
            } else {
                message.error('No se pudo eliminar el registro');
            }
        } catch (error) {
            console.log('Error al eliminar:', error);
        }
    };

    // 7. Columnas de la tabla
    const columnas = [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
        { title: 'Riego', dataIndex: 'riego', key: 'riego' },
        { title: 'Raiz', dataIndex: 'raiz', key: 'raiz' },
        { title: 'Crecimiento', dataIndex: 'crecimiento', key: 'crecimiento' },
        { title: 'Asoleamiento', dataIndex: 'asoleamiento', key: 'asoleamiento' },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost onClick={() => abrirModalEditar(record)}>
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Eliminar registro?"
                        description="Esta acción no se puede deshacer."
                        onConfirm={() => handleEliminar(record.id)}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                    >
                        <Button danger>Eliminar</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 8. El contenido principal (Botón de agregar + Tabla)
    const contents = (
        <Space orientation="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={abrirModalAgregar}>
                + Agregar Vegetación
            </Button>
            <Table
                columns={columnas}
                dataSource={forecasts || []}
                loading={forecasts === undefined}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
            />
        </Space>
    );

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        }
                    ]}
                />
            </Sider>

            <Header style={{ padding: 0, background: colorBgContainer }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            </Header>


            <Content style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                {/*<Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]} />*/}
                {/*<div style={{ background: colorBgContainer, minHeight: 280, padding: 24, borderRadius: borderRadiusLG }}>*/}
                    {contents}
                {/*</div>*/}
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>

            {/* 9. El componente de la ventana emergente */}
            <Modal
                title={registroEditando ? "Editar Vegetación" : "Agregar Vegetación"}
                open={isModalVisible}
                onOk={handleGuardar}
                onCancel={handleCancelar}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical" name="vegetacionForm">
                    <Form.Item name="nombre" label="Nombre de la Vegetación" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
                        <Input placeholder="Ej. Mezquite" />
                    </Form.Item>
                    <Form.Item
                        name="tipo"
                        label="Tipo de Vegetación"
                        rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
                    >
                        <Select placeholder="Selecciona una opción">
                            <Select.Option value={1}>Árbol</Select.Option>
                            <Select.Option value={2}>Arbusto</Select.Option>
                            <Select.Option value={3}>Suculenta</Select.Option>
                            <Select.Option value={4}>Herbacea</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="asoleamiento"
                        label="Tipo de Asoleamiento"
                        rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
                    >
                        <Select placeholder="Selecciona una opción">
                            <Select.Option value={1}>Pleno sol</Select.Option>
                            <Select.Option value={2}>Sombra parcial</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="crecimiento"
                        label="Tipo de Crecimiento"
                        rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
                    >
                        <Select placeholder="Selecciona una opción">
                            <Select.Option value={1}>Rapido</Select.Option>
                            <Select.Option value={2}>Moderado</Select.Option>
                            <Select.Option value={3}>Lento</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="raiz"
                        label="Tipo de Raiz"
                        rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
                    >
                        <Select placeholder="Selecciona una opción">
                            <Select.Option value={1}>Profunda</Select.Option>
                            <Select.Option value={2}>Superficial</Select.Option>
                            <Select.Option value={3}>Extendida</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="riego"
                        label="Tipo de Riego"
                        rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
                    >
                        <Select placeholder="Selecciona una opción">
                            <Select.Option value={1}>Muy bajo</Select.Option>
                            <Select.Option value={2}>Bajo</Select.Option>
                            <Select.Option value={3}>Moderado</Select.Option>
                            <Select.Option value={4}>Alto</Select.Option>
                            <Select.Option value={5}>Vegetales y cesped</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </Layout>
    );
};

export default App;