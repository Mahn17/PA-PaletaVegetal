import React from "react";
import "./EstimacionRiego.css";
import { Table, Tag } from "antd";

const columns = [
    { title: "Periodo / Comp.", dataIndex: "comp", key: "comp" },
    { title: "ENE", dataIndex: "ene", key: "ene" },
    { title: "FEB", dataIndex: "feb", key: "feb" },
    { title: "MAR", dataIndex: "mar", key: "mar" },
    { title: "ABR", dataIndex: "abr", key: "abr" },
    { title: "MAY", dataIndex: "may", key: "may" },
    { title: "JUN", dataIndex: "jun", key: "jun" },
    { title: "JUL", dataIndex: "jul", key: "jul" },
    { title: "AGO", dataIndex: "ago", key: "ago" },
    { title: "SEP", dataIndex: "sep", key: "sep" },
    { title: "OCT", dataIndex: "oct", key: "oct" },
    { title: "NOV", dataIndex: "nov", key: "nov" },
    { title: "DIC", dataIndex: "dic", key: "dic" },
];

const data = [
    {
        key: "1",
        comp: "Hojas",
        jun: <Tag color="green">✔</Tag>,
        jul: <Tag color="green">✔</Tag>,
        ago: <Tag color="green">✔</Tag>,
        sep: <Tag color="green">✔</Tag>,
        oct: <Tag color="green">100%</Tag>,
        nov: <Tag color="green">100%</Tag>,
    },
    {
        key: "2",
        comp: "Corteza",
        ene: <Tag color="brown">●</Tag>,
        feb: <Tag color="brown">●</Tag>,
        mar: <Tag color="brown">●</Tag>,
        abr: <Tag color="brown">●</Tag>,
        may: <Tag color="brown">●</Tag>,
        jun: <Tag color="brown">●</Tag>,
        jul: <Tag color="brown">●</Tag>,
        ago: <Tag color="brown">●</Tag>,
        sep: <Tag color="brown">●</Tag>,
        oct: <Tag color="brown">●</Tag>,
        nov: <Tag color="brown">●</Tag>,
        dic: <Tag color="brown">●</Tag>,
    },
    {
        key: "3",
        comp: "Flores",
        feb: <Tag color="pink">25%</Tag>,
        mar: <Tag color="magenta">100%</Tag>,
        abr: <Tag color="magenta">100%</Tag>,
        may: <Tag color="pink">50%</Tag>,
    },
    {
        key: "4",
        comp: "Frutos",
        jul: <Tag color="orange">25%</Tag>,
        ago: <Tag color="orange">50%</Tag>,
        sep: <Tag color="orange">100%</Tag>,
        oct: <Tag color="orange">75%</Tag>,
    },
    {
        key: "5",
        comp: "Semillas",
        sep: <Tag color="geekblue">50%</Tag>,
        oct: <Tag color="geekblue">100%</Tag>,
    },
];

function EstimacionRiego() {
    return (
        <div style={{fontSize: "15px" } }>
            <h2>Estimación de Riego</h2>
            <p>El riego o la cantidad de agua que las plantas requieren (Requerimiento de agua), se establece
                utilizando una metodología elaborada por el Departamento de Ciencias Agrícolas de la Universidad
                de Arizona.</p>

            <p>Primero, se determinaron cinco categorías de riego: Muy bajo, Bajo, Moderado, Alto, y por último
                Vegetales y césped. En el caso de esta paleta, no se incluyeron especies que se hallen en las dos
                clasificaciones de mayor demanda.</p>

            <p>Segundo, las cantidades específicas de requerimiento de agua por cada categoría de riego se
                muestran en la siguiente tabla, calculadas a través de los valores de precipitación, evapotranspiración
                y coeficiente de demanda específicos para la región. La tabla elaborada por el Departamento de
                Ciencias Agrícolas de la Universidad de Arizona, fue ajustada con los valores mensuales de las normales
                climatológicas del Servicio Meteorológico Nacional (Periodo 1951 – 2010 para Hermosillo, Sonora). </p>

            <img src="/FotosPV/cant_agua.png" alt="Cantidad de agua" width="750"/>

            <p>Posteriormente se utiliza la siguiente fórmula para calcular de forma precisa el agua que una planta
                necesita, con base en su requerimiento de riego y en el área que abarca su follaje:</p>

            <div>
                <h2>Fórmula de demanda de agua</h2>
                <div style={{
                    backgroundColor: "#f9a825",
                    padding: "10px",
                    borderRadius: "5px",
                    display: "inline-block"
                }}>
                    <strong>D = (AF)(rₐ)</strong>
                </div>

                <h3>Donde:</h3>
                <ul>
                    <li><strong>D</strong> = Demanda de agua en litros</li>
                    <li><strong>AF</strong> = Área de follaje (copa) en m²</li>
                    <li><strong>rₐ</strong> = Requerimiento de agua en mm</li>
                </ul>

                <p><em>Nota:</em> El cálculo se puede hacer para cantidades mensuales o anuales.</p>
            </div>

            <h2>Cálculo simplificado de cantidades de riego</h2>
            <p>Para un acercamiento más práctico y sencillo, la siguiente tabla expresa cantidades de agua que
                una planta requiere dependiendo del área aproximada de su copa o follaje y diferenciando entre
                temporada cálida (abril a septiembre) y fría (octubre a marzo). Las cantidades de agua se expresan
                en litros anuales y por semana.</p>
             <p>El objetivo es facilitar el riego al conocer la cantidad de agua que la planta necesita por semana. Se
                debe considerar que durante la temporada cálida, se recomienda distribuir dicha cantidad en tres
                riegos por semana, y en la temporada fría en dos o uno por semana. Además, se recomienda regar
                durante la tarde o noche para reducir las pérdidas por evaporación.</p>
            <img src="/FotosPV/cant_agua_follaje.png" alt="Cantidad de agua" width="800" />

            <p>A continuación, se muestran las áreas incluidas en la tabla anterior con una referencia de dimensiones
                similares para facilitar las estimaciones de requerimiento de agua por planta. </p>
            <div>
                <h2>Referencias de área</h2>
                <table className="tabla-referencias">
                    <thead>
                        <tr>
                            <th>Área</th>
                            <th>Referencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 1</td>
                            <td>Sillón individual</td>
                        </tr>
                        <tr>
                            <td>1 a 4</td>
                            <td>Cama king size</td>
                        </tr>
                        <tr>
                            <td>4 a 9</td>
                            <td>Pick up mediano</td>
                        </tr>
                        <tr>
                            <td>9 a 25</td>
                            <td>Camión urbano</td>
                        </tr>
                        <tr>
                            <td>&gt; 25</td>
                            <td>Tres cajones de estacionamiento</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p><em>Nota:</em> Las especies con un requerimiento de riego Muy Bajo y Bajo, mismas que suelen ser nativas al
                Desierto Sonorense, solo requieren que se les proporcione riego los primeros 2 a 4 años de su vida.
                Pasando esta fase de desarrollo, pueden sobrevivir con la precipitación de la región. Sin embargo,
                las plantas seguirán consumiendo la cantidad de agua indicada, ya sea que la obtengan de humedad
                disponible en el subsuelo, de humedad atmosférica o de la precipitación. </p>

            {/*<Table*/}
            {/*    columns={columns}*/}
            {/*    dataSource={data}*/}
            {/*    pagination={false}*/}
            {/*    bordered*/}
            {/*/>*/}
            {/*<div>*/}
            {/*    <h2>Calendario Fenológico</h2>*/}
            {/*    <table style={{ borderCollapse: "collapse", width: "100%" }}>*/}
            {/*        <thead>*/}
            {/*            <tr>*/}
            {/*                <th>Periodo / Comp.</th>*/}
            {/*                <th>ENE</th><th>FEB</th><th>MAR</th><th>ABR</th>*/}
            {/*                <th>MAY</th><th>JUN</th><th>JUL</th><th>AGO</th>*/}
            {/*                <th>SEP</th><th>OCT</th><th>NOV</th><th>DIC</th>*/}
            {/*            </tr>*/}
            {/*        </thead>*/}
            {/*        <tbody>*/}
            {/*            <tr>*/}
            {/*                <td>Hojas</td>*/}
            {/*                <td></td><td></td><td></td><td></td><td></td>*/}
            {/*                <td style={{ backgroundColor: "lightgreen" }}>✔</td>*/}
            {/*                <td style={{ backgroundColor: "lightgreen" }}>✔</td>*/}
            {/*                <td style={{ backgroundColor: "lightgreen" }}>✔</td>*/}
            {/*                <td style={{ backgroundColor: "lightgreen" }}>✔</td>*/}
            {/*                <td style={{ backgroundColor: "green", color: "white" }}>100%</td>*/}
            {/*                <td style={{ backgroundColor: "green", color: "white" }}>100%</td>*/}
            {/*                <td></td>*/}
            {/*            </tr>*/}
            {/*            <tr>*/}
            {/*                <td>Corteza</td>*/}
            {/*                {Array.from({ length: 12 }).map((_, i) => (*/}
            {/*                    <td key={i} style={{ backgroundColor: "saddlebrown", color: "white" }}>●</td>*/}
            {/*                ))}*/}
            {/*            </tr>*/}
            {/*            <tr>*/}
            {/*                <td>Flores</td>*/}
            {/*                <td></td>*/}
            {/*                <td style={{ backgroundColor: "pink" }}>25%</td>*/}
            {/*                <td style={{ backgroundColor: "deeppink", color: "white" }}>100%</td>*/}
            {/*                <td style={{ backgroundColor: "deeppink", color: "white" }}>100%</td>*/}
            {/*                <td style={{ backgroundColor: "pink" }}>50%</td>*/}
            {/*                <td></td><td></td><td></td><td></td><td></td><td></td><td></td>*/}
            {/*            </tr>*/}
            {/*            */}{/* Frutos y Semillas igual */}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*</div>*/}
        </div>
    );
}

export default EstimacionRiego;