import React, { useEffect, useState } from 'react';
import { Form, Space, Button, Table, Popconfirm, Modal, message, Input, Select, InputNumber, Upload } from 'antd';
import { SearchOutlined, FilterOutlined, UploadOutlined, FileImageOutlined, PictureOutlined } from '@ant-design/icons';
export default function Especies() {
    const [forecasts, setForecasts] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [registroEditando, setRegistroEditando] = useState(null);
    const [form] = Form.useForm();
    const [archivoFoto, setArchivoFoto] = useState(null);
    const [archivoTabla, setArchivoTabla] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    
    useEffect(() => {
        async function populateWeatherData() {
            const response = await fetch(`${API_BASE_URL}/api/vegetacion`);
            if (response.ok) {
                const data = await response.json();
                setForecasts(data);
            }
        }
        populateWeatherData();
    }, []);

    const abrirModalAgregar = () => {
        setRegistroEditando(null);
        setArchivoFoto(null);
        setArchivoTabla(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const abrirModalEditar = (record) => {
        setRegistroEditando(record);
        setArchivoFoto(null);
        setArchivoTabla(null);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleCancelar = () => {
        setIsModalVisible(false);
        setArchivoFoto(null);
        setArchivoTabla(null);
    };

    const handleGuardar = async () => {
        try {
            const valores = await form.validateFields();
            if (!registroEditando) {
                if (!archivoFoto) {
                    message.error('La fotografía de la planta es obligatoria.');
                    return;
                }
                if (!archivoTabla) {
                    message.error('La tabla cromática es obligatoria.');
                    return;
                }
            }
            const url = registroEditando ? `${API_BASE_URL}/api/vegetacion/${registroEditando.id}` : `${API_BASE_URL}/api/vegetacion`;
            const metodo = registroEditando ? 'PUT' : 'POST';
            const cuerpoPeticion = registroEditando ? { ...valores, id: registroEditando.id } : valores;

            const responseTexto = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpoPeticion)
            });

            if (responseTexto.ok) {
                // Sacamos el ID (si era edición ya lo tenemos, si era nuevo lo sacamos de la respuesta de C#)
                let idRegistro = registroEditando ? registroEditando.id : null;
                if (!registroEditando) {
                    const dataCreada = await responseTexto.json();
                    idRegistro = dataCreada.id;
                }

                // 3. Subimos la imagen atada al ID (Solo si el usuario seleccionó una foto)
                if (archivoFoto && idRegistro) {
                    const formDataFoto = new FormData();
                    formDataFoto.append('file', archivoFoto);
                    // Apuntamos al endpoint .../image/{id}/foto
                    await fetch(`${API_BASE_URL}/api/vegetacion/image/${idRegistro}/foto`, { method: 'POST', body: formDataFoto });
                }
                // 4. SUBIDA TABLA (Si se seleccionó archivo)
                if (archivoTabla && idRegistro) {
                    const formDataTabla = new FormData();
                    formDataTabla.append('file', archivoTabla);
                    // Apuntamos al endpoint .../image/{id}/tabla
                    await fetch(`${API_BASE_URL}/api/vegetacion/image/${idRegistro}/tabla`, { method: 'POST', body: formDataTabla });
                }
                message.success(`Vegetación ${registroEditando ? 'actualizada' : 'agregada'} correctamente`);
                setIsModalVisible(false);
                setArchivoFoto(null);
                setArchivoTabla(null);
                //recarga de tabla
                const refreshResponse = await fetch(`${API_BASE_URL}/api/vegetacion`);
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setForecasts(data);
                }
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
                const refreshResponse = await fetch('api/vegetacion');
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setForecasts(data);
                }
            } else {
                message.error('No se pudo eliminar el registro');
            }
        } catch (error) {
            console.log('Error al eliminar:', error);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Buscar...`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Buscar
                    </Button>
                    <Button onClick={() => { clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>
                        Limpiar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    });

    const getColumnRangeProps = (dataIndexMin, dataIndexMax) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            const [min, max] = selectedKeys[0] || [null, null];
            return (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                    <Space style={{ marginBottom: 8 }}>
                        <InputNumber
                            placeholder="Mínimo"
                            value={min}
                            onChange={(val) => setSelectedKeys([[val, max]])}
                            style={{ width: 100 }}
                        />
                        <span>-</span>
                        <InputNumber
                            placeholder="Máximo"
                            value={max}
                            onChange={(val) => setSelectedKeys([[min, val]])}
                            style={{ width: 100 }}
                        />
                    </Space>
                    <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="primary" onClick={() => confirm()} icon={<FilterOutlined />} size="small" style={{ width: 90 }}>
                            Filtrar
                        </Button>
                        <Button onClick={() => { setSelectedKeys([]); clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>
                            Limpiar
                        </Button>
                    </Space>
                </div>
            );
        },
        filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => {
            const [searchMin, searchMax] = value || [null, null];
            const recMin = record[dataIndexMin];
            const recMax = record[dataIndexMax];

            // Lógica de solapamiento: Muestra la planta si su rango toca el rango buscado
            const pasaMinimo = searchMin === null || searchMin === undefined || recMax >= searchMin;
            const pasaMaximo = searchMax === null || searchMax === undefined || recMin <= searchMax;
            return pasaMinimo && pasaMaximo;
        },
    });

    const columnas = [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        {
            title: 'Nombre', dataIndex: 'nombre',
            key: 'nombre',
            ...getColumnSearchProps('nombre')
        },
        {
            title: 'Tipo', dataIndex: 'tipo',
            key: 'tipo',
            filters: [
                { text: 'Árbol', value: 'Arbol' },
                { text: 'Arbusto', value: 'Arbusto' },
                { text: 'Suculenta', value: 'Suculenta' },
                { text: 'Herbácea', value: 'Herbacea' },
            ],
            onFilter: (value, record) => record.tipo === value,
        },
        {
            title: 'Riego', dataIndex: 'riego',
            key: 'riego',
            filters: [
                { text: 'Muy bajo', value: 'MuyBajo' },
                { text: 'Bajo', value: 'Bajo' },
                { text: 'Moderado', value: 'Moderado' },
                { text: 'Alto', value: 'Alto' },
                { text: 'Vegetales y césped', value: 'VegetalesYCesped' },
            ],
            onFilter: (value, record) => record.riego === value
        },
        { title: 'Raiz', dataIndex: 'raiz', key: 'raiz' },
        {
            title: 'Crecimiento', dataIndex: 'crecimiento',
            key: 'crecimiento',
            filters: [
                { text: 'Rapido', value: 'Rapido' },
                { text: 'Moderado', value: 'Moderado' },
                { text: 'Lento', value: 'Lento' },
            ],
            onFilter: (value, record) => record.crecimiento === value
        },
        {title: 'Medidas (m)',
        children: [
            {
                title: 'Altura',
                dataIndex: 'altura',
                key: 'altura',
                render: (_, record) => `${record.alturaMin} - ${record.alturaMax}`,
                ...getColumnRangeProps('alturaMin', 'alturaMax') // <-- Buscador de rangos

                //width: 200,
            },
            {
                title: 'Copa Ø',
                dataIndex: 'copa',
                key: 'copa',
                render: (_, record) => `${record.copaMin} - ${record.copaMax}`,
                ...getColumnRangeProps('copaMin', 'copaMax')
            },
            {
                title: 'Tronco Ø',
                dataIndex: 'tronco',
                key: 'tronco',
                render: (_, record) => `${record.troncoMin} - ${record.troncoMax}`,
                ...getColumnRangeProps('troncoMin', 'troncoMax')
            }
            ]
        },
        {
            title: 'Asoleamiento', dataIndex: 'asoleamiento',
            key: 'asoleamiento',
            filters: [
                { text: 'Pleno sol', value: 'Pleno_sol' },
                { text: 'Sombra parcial', value: 'SombraParcial' },
            ],
            onFilter: (value, record) => record.asoleamiento === value
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost onClick={() => abrirModalEditar(record)}>Editar</Button>
                    <Popconfirm
                        title="¿Eliminar registro?"
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

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" onClick={abrirModalAgregar}>+ Agregar Vegetación</Button>
                <Table
                    columns={columnas}
                    dataSource={forecasts || []}
                    loading={forecasts === undefined}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                    expandable={{
                        expandedRowRender: (record) => {
                            const recursosVisuales = [
                                {
                                    key: 'foto',
                                    titulo: 'Fotografía de la Planta',
                                    ruta: record.imagenUrl ? `${API_BASE_URL}${record.imagenUrl}` : `/FotosPV/foto.png`, // Usamos la URL real
                                    anchoMaximo: 300,
                                    icono: <PictureOutlined />
                                },
                                {
                                    key: 'tabla',
                                    titulo: 'Tabla Cromática',
                                    ruta: record.tablaCromaticaUrl ? `${API_BASE_URL}${record.tablaCromaticaUrl}` : `/FotosPV/tabla.png`, // Usamos la URL real de la tabla
                                    anchoMaximo: 700,
                                    icono: <FileImageOutlined />
                                }
                            ];
                            return (
                                <Table
                                    dataSource={recursosVisuales}
                                    pagination={false}
                                    showHeader={false}
                                    columns={[{ title: 'Recurso', dataIndex: 'titulo', key: 'titulo' }]}
                                    expandable={{
                                        expandedRowRender: (recurso) => (
                                            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                                                <img src={recurso.ruta} alt={recurso.titulo} style={{ width: '100%', maxWidth: recurso.anchoMaximo, borderRadius: 8 }} />
                                            </div>
                                        )
                                    }}
                                />
                            );
                        },
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                />
            </Space>

            <Modal title={registroEditando ? "Editar Vegetación" : "Agregar Vegetación"} open={isModalVisible} onOk={handleGuardar} onCancel={handleCancelar} okText="Guardar" cancelText="Cancelar">
                <Form form={form} layout="vertical" name="vegetacionForm">
                    <Form.Item name="nombre" label="Nombre de la Vegetación" rules={[{ required: true, message: 'Ingresa el nombre' }]}><Input placeholder="Ej. Mezquite" /></Form.Item>
                    <Form.Item
                        label="Fotografía de la Planta"
                        required={!registroEditando} // Muestra asterisco si es nuevo
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={(file) => {
                                setArchivoFoto(file); // Guarda en estado de Foto
                                return false;
                            }}
                            onRemove={() => setArchivoFoto(null)}
                        >
                            <Button icon={<PictureOutlined />}>Seleccionar Imagen</Button>
                        </Upload>
                        {registroEditando && (
                            <span style={{ fontSize: '12px', color: 'gray', display: 'block', marginTop: 5 }}>
                                Deja esto en blanco para conservar la foto actual.
                            </span>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Tabla Cromática"
                        required={!registroEditando} // Muestra asterisco si es nuevo
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={(file) => {
                                setArchivoTabla(file); // Guarda en estado de Tabla
                                return false;
                            }}
                            onRemove={() => setArchivoTabla(null)}
                        >
                            <Button icon={<FileImageOutlined />}>Seleccionar Tabla</Button>
                        </Upload>
                        {registroEditando && (
                            <span style={{ fontSize: '12px', color: 'gray', display: 'block', marginTop: 5 }}>
                                Deja esto en blanco para conservar la tabla actual.
                            </span>
                        )}
                    </Form.Item>
                    <Form.Item name="tipo" label="Tipo de Vegetación" rules={[{ required: true, message: 'Selecciona el tipo' }]}><Select><Select.Option value={1}>Árbol</Select.Option><Select.Option value={2}>Arbusto</Select.Option><Select.Option value={3}>Suculenta</Select.Option><Select.Option value={4}>Herbacea</Select.Option></Select></Form.Item>
                    <Form.Item name="asoleamiento" label="Tipo de Asoleamiento" rules={[{ required: true, message: 'Selecciona el tipo' }]}><Select><Select.Option value={1}>Pleno sol</Select.Option><Select.Option value={2}>Sombra parcial</Select.Option></Select></Form.Item>
                    <Form.Item name="crecimiento" label="Tipo de Crecimiento" rules={[{ required: true, message: 'Selecciona el tipo' }]}><Select><Select.Option value={1}>Rapido</Select.Option><Select.Option value={2}>Moderado</Select.Option><Select.Option value={3}>Lento</Select.Option></Select></Form.Item>
                    <Space wrap size="large" style={{  marginBottom: 8 }} align="baseline" size="large">
                        <Form.Item label="Altura (m)">
                            <Space.Compact>
                                <Form.Item name="alturaMin" noStyle rules={[{ required: true, message: 'Falta Min' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Min" />
                                </Form.Item>
                                <Input style={{ width: '30px', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="-" disabled />
                                <Form.Item name="alturaMax" noStyle rules={[{ required: true, message: 'Falta Max' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Máx" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item label="Tronco (m)">
                            <Space.Compact>
                                <Form.Item name="troncoMin" noStyle rules={[{ required: true, message: 'Falta Min' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Min" />
                                </Form.Item>
                                <Input style={{ width: '30px', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="-" disabled />
                                <Form.Item name="troncoMax" noStyle rules={[{ required: true, message: 'Falta Max' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Máx" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item label="Copa (m)">
                            <Space.Compact>
                                <Form.Item name="copaMin" noStyle rules={[{ required: true, message: 'Falta Min' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Min" />
                                </Form.Item>
                                <Input style={{ width: '30px', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="-" disabled />
                                <Form.Item name="copaMax" noStyle rules={[{ required: true, message: 'Falta Max' }]}>
                                    <InputNumber style={{ width: '80px' }} min={0} step={0.1} placeholder="Máx" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>
                    </Space>
                    <Form.Item name="raiz" label="Tipo de Raiz" rules={[{ required: true, message: 'Selecciona el tipo' }]}><Select><Select.Option value={1}>Profunda</Select.Option><Select.Option value={2}>Superficial</Select.Option><Select.Option value={3}>Extendida</Select.Option></Select></Form.Item>
                    <Form.Item name="riego" label="Tipo de Riego" rules={[{ required: true, message: 'Selecciona el tipo' }]}><Select><Select.Option value={1}>Muy bajo</Select.Option><Select.Option value={2}>Bajo</Select.Option><Select.Option value={3}>Moderado</Select.Option><Select.Option value={4}>Alto</Select.Option><Select.Option value={5}>Vegetales y cesped</Select.Option></Select></Form.Item>
                </Form>
            </Modal>
        </>
    );
}
