// Arrays para almacenar datos
const libroDiarioData = JSON.parse(localStorage.getItem('libroDiarioData')) || [];
const libroMayorData = JSON.parse(localStorage.getItem('libroMayorData')) || {};
const ventasData = JSON.parse(localStorage.getItem('ventasData')) || [];
const comprasData = JSON.parse(localStorage.getItem('comprasData')) || [];
let inventarioData = JSON.parse(localStorage.getItem('inventarioData')) || [];
let clientesData = JSON.parse(localStorage.getItem('clientesData')) || [];
let proveedoresData = JSON.parse(localStorage.getItem('proveedoresData')) || [];

// Función para actualizar el menú desplegable de clientes
function populateClientesDropdown() {
    const clienteSelect = document.getElementById('Cliente');
    if (!clienteSelect) return;
    
    console.log('Actualizando dropdown de clientes');
    console.log('Clientes disponibles:', clientesData);
    
    // Obtener los clientes del DOM
    clienteSelect.innerHTML = `
        <option value="">Seleccione un cliente</option>
        ${clientesData.map(cliente => 
            `<option value="${cliente.nombre}">${cliente.nombre}</option>`
        ).join('')}
    `;
}

// Función para actualizar el menú desplegable de productos
function populateProductosDropdown() {
    const productoSelect = document.getElementById('Producto');
    if (!productoSelect) return;
    
    console.log('Actualizando dropdown de productos');
    console.log('Productos disponibles:', inventarioData);
    
    // Actualizar el menú desplegable
    productoSelect.innerHTML = `
        <option value="">Seleccione un producto</option>
        ${inventarioData.map(producto => 
            `<option value="${producto.producto}">${producto.producto} (Stock: ${producto.cantidad})</option>`
        ).join('')}
    `;
}

// Función para actualizar el menú desplegable de proveedores
function populateProveedoresDropdown() {
    const proveedorSelect = document.getElementById('Proveedor');
    if (!proveedorSelect) return;
    
    console.log('Actualizando dropdown de proveedores');
    console.log('Proveedores disponibles:', proveedoresData);
    
    proveedorSelect.innerHTML = `
        <option value="">Seleccione un proveedor</option>
        ${proveedoresData.map(proveedor => 
            `<option value="${proveedor.nombre}">${proveedor.nombre}</option>`
        ).join('')}
    `;
}

// Función para procesar venta y actualizar inventario
function procesarVenta(producto, cantidad) {
    console.log('Buscando producto:', producto);
    console.log('Inventario actual:', inventarioData);

    // Limpiar el nombre del producto (por si viene con el texto del stock)
    const nombreProducto = producto.split('(')[0].trim();

    const item = inventarioData.find(item => {
        console.log('Comparando:', item.producto, 'con:', nombreProducto);
        return item.producto.toLowerCase() === nombreProducto.toLowerCase();
    });

    if (!item) {
        showNotification(`Producto ${nombreProducto} no encontrado en inventario`);
        return false;
    }

    if (item.cantidad < cantidad) {
        showNotification(`Stock insuficiente. Solo hay ${item.cantidad} unidades disponibles`);
        return false;
    }

    // Restar la cantidad vendida del inventario
    item.cantidad -= cantidad;
    
    // Guardar cambios en localStorage
    localStorage.setItem('inventarioData', JSON.stringify(inventarioData));

    // Actualizar la vista del inventario y el menú desplegable
    updateInventarioView();
    populateProductosDropdown();

    return true;
}

// Función para procesar compra y actualizar inventario
function procesarCompra(producto, cantidad) {
    const item = inventarioData.find(item => item.producto.toLowerCase() === producto.toLowerCase());

    if (item) {
        // Si el producto existe, aumentar la cantidad
        item.cantidad += cantidad;
    } else {
        // Si el producto no existe, agregarlo al inventario
        inventarioData.push({
            producto: producto,
            cantidad: cantidad
        });
    }
    
    // Guardar cambios en localStorage
    localStorage.setItem('inventarioData', JSON.stringify(inventarioData));
    
    // Actualizar vistas
    updateInventarioView();
    populateProductosDropdown();
    return true;
}

// Function to update the inventory view
function updateInventarioView() {
    const inventarioView = document.getElementById('inventoryView');
    if (!inventarioView) return;

    if (inventarioData.length === 0) {
        inventarioView.innerHTML = '<p class="text-gray-500">No hay productos en el inventario</p>';
        return;
    }

    inventarioView.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${inventarioData.map(item => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">${item.producto}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.cantidad}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Function to update the sales list view
function updateVentasView() {
    const ventasView = document.getElementById('ventasView');
    if (!ventasView) return;

    if (ventasData.length === 0) {
        ventasView.innerHTML = '<p class="text-gray-500">No hay ventas registradas</p>';
        return;
    }

    ventasView.innerHTML = ventasData.map((venta, index) => `
        <div class="bg-gray-50 p-4 rounded shadow mb-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="font-medium">Fecha: ${venta.fecha}</p>
                    <p class="text-gray-600">Cliente: ${venta.cliente}</p>
                    <p class="text-gray-600">Producto: ${venta.producto}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <p class="font-medium">Cantidad: ${venta.cantidad}</p>
                        <p class="text-green-600">Precio: $${venta.precio.toFixed(2)}</p>
                        <p class="text-green-600">Total: $${venta.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to update the purchases list view
function updateComprasView() {
    const comprasView = document.getElementById('comprasView');
    if (!comprasView) return;

    if (comprasData.length === 0) {
        comprasView.innerHTML = '<p class="text-gray-500">No hay compras registradas</p>';
        return;
    }

    comprasView.innerHTML = comprasData.map((compra, index) => `
        <div class="bg-gray-50 p-4 rounded shadow mb-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="font-medium">Fecha: ${compra.fecha}</p>
                    <p class="text-gray-600">Proveedor: ${compra.proveedor}</p>
                    <p class="text-gray-600">Producto: ${compra.producto}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <p class="font-medium">Cantidad: ${compra.cantidad}</p>
                        <p class="text-green-600">Precio: $${compra.precio.toFixed(2)}</p>
                        <p class="text-green-600">Total: $${compra.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to show notifications
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Function to manage section visibility
function showSection(sectionId) {
    console.log('Mostrando sección:', sectionId);
    
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    // Acciones específicas según la sección
    switch(sectionId) {
        case 'ventas':
            populateClientesDropdown();
            populateProductosDropdown();
            updateVentasView();
            break;
        case 'compras':
            populateProveedoresDropdown();
            populateProductosDropdown();
            updateComprasView();
            break;
        case 'clientes':
            updateClientesView();
            break;
        case 'proveedores':
            updateProveedoresView();
            break;
        case 'inventario':
            updateInventarioView();
            populateProductosDropdown();
            break;
        case 'reportes':
            // Preparar cualquier cosa necesaria para reportes
            break;
    }
}

// Function to update the clients view
function updateClientesView() {
    const clientesView = document.getElementById('ClientesView');
    if (!clientesView) return;

    if (clientesData.length === 0) {
        clientesView.innerHTML = '<p class="text-gray-500">No hay clientes registrados</p>';
        return;
    }

    clientesView.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUIT</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${clientesData.map(cliente => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">${cliente.nombre}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${cliente.cuit}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${cliente.telefono}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${cliente.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${cliente.direccion}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Function to update the providers view
function updateProveedoresView() {
    const proveedoresView = document.getElementById('ProveedoresView');
    if (!proveedoresView) return;

    if (proveedoresData.length === 0) {
        proveedoresView.innerHTML = '<p class="text-gray-500">No hay proveedores registrados</p>';
        return;
    }

    proveedoresView.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUIT</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${proveedoresData.map(proveedor => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">${proveedor.nombre}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${proveedor.cuit}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${proveedor.telefono}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${proveedor.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${proveedor.direccion}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Function to generate reports
function generateReport() {
    console.log('Generando reporte...'); // Debug log
    const period = document.getElementById('reportPeriod').value;
    const type = document.getElementById('reportType').value;

    console.log('Período seleccionado:', period);
    console.log('Tipo de reporte seleccionado:', type);
    console.log('Datos de ventas:', ventasData);
    console.log('Datos de compras:', comprasData);
    console.log('Datos de inventario:', inventarioData);

    const reportHeader = document.getElementById('reportHeader');
    const reportContent = document.getElementById('reportContent');
    const reportSummary = document.getElementById('reportSummary');
    
    if (!reportHeader || !reportContent || !reportSummary) {
        console.error('No se encontraron los elementos del reporte');
        showNotification('Error al generar el reporte');
        return;
    }

    // Generar encabezado del reporte
    reportHeader.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800">Reporte de ${getReportTypeName(type)}</h3>
        <p class="text-sm text-gray-600">Período: ${getReportPeriodName(period)}</p>
        <p class="text-sm text-gray-600">Fecha de generación: ${new Date().toLocaleString()}</p>
    `;
    
    // Generar contenido según el tipo de reporte
    switch (type) {
        case 'sales':
            console.log('Generando reporte de ventas');
            generateSalesReport(reportContent, reportSummary);
            break;
        case 'purchases':
            console.log('Generando reporte de compras');
            generatePurchasesReport(reportContent, reportSummary);
            break;
        case 'inventory':
            console.log('Generando reporte de inventario');
            generateInventoryReport(reportContent, reportSummary);
            break;
        case 'profit':
            console.log('Generando reporte de ganancias');
            generateProfitReport(reportContent, reportSummary);
            break;
        case 'complete':
            console.log('Generando reporte completo');
            generateCompleteReport(reportContent, reportSummary);
            break;
        default:
            reportContent.innerHTML = '<p class="text-red-500">Tipo de reporte no válido</p>';
            break;
    }
}

function getReportTypeName(type) {
    const types = {
        'sales': 'Ventas',
        'purchases': 'Compras',
        'inventory': 'Inventario',
        'profit': 'Ganancias',
        'complete': 'Reporte Completo'
    };
    return types[type] || type;
}

function getReportPeriodName(period) {
    const periods = {
        'day': 'Hoy',
        'week': 'Esta Semana',
        'month': 'Este Mes',
        'year': 'Este Año',
        'custom': 'Personalizado'
    };
    return periods[period] || period;
}

function generateSalesReport(contentDiv, summaryDiv) {
    console.log('Generando reporte de ventas - Datos:', ventasData);
    
    if (ventasData.length === 0) {
        console.warn('No hay ventas registradas');
        contentDiv.innerHTML = '<p class="text-gray-500">No hay ventas registradas en este período</p>';
        return;
    }

    let totalVentas = 0;
    let totalItems = 0;

    contentDiv.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${ventasData.map(venta => {
                    totalVentas += venta.total;
                    totalItems += venta.cantidad;
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${venta.fecha}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${venta.cliente}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${venta.producto}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${venta.cantidad}</td>
                            <td class="px-6 py-4 whitespace-nowrap">$${venta.precio.toFixed(2)}</td>
                            <td class="px-6 py-4 whitespace-nowrap">$${venta.total.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    console.log('Total de ventas:', totalVentas);
    console.log('Total de items:', totalItems);

    summaryDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Total Ventas</p>
                <p class="text-2xl font-bold text-indigo-600">$${totalVentas.toFixed(2)}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Items Vendidos</p>
                <p class="text-2xl font-bold text-indigo-600">${totalItems}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Promedio por Venta</p>
                <p class="text-2xl font-bold text-indigo-600">$${(totalVentas / ventasData.length).toFixed(2)}</p>
            </div>
        </div>
    `;
}

function generatePurchasesReport(contentDiv, summaryDiv) {
    console.log('Generando reporte de compras - Datos:', comprasData);
    
    if (comprasData.length === 0) {
        console.warn('No hay compras registradas');
        contentDiv.innerHTML = '<p class="text-gray-500">No hay compras registradas en este período</p>';
        return;
    }

    let totalCompras = 0;
    let totalItems = 0;

    contentDiv.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${comprasData.map(compra => {
                    totalCompras += compra.total;
                    totalItems += compra.cantidad;
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${compra.fecha}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${compra.proveedor}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${compra.producto}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${compra.cantidad}</td>
                            <td class="px-6 py-4 whitespace-nowrap">$${compra.precio.toFixed(2)}</td>
                            <td class="px-6 py-4 whitespace-nowrap">$${compra.total.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    console.log('Total de compras:', totalCompras);
    console.log('Total de items:', totalItems);

    summaryDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Total Compras</p>
                <p class="text-2xl font-bold text-indigo-600">$${totalCompras.toFixed(2)}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Items Comprados</p>
                <p class="text-2xl font-bold text-indigo-600">${totalItems}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Promedio por Compra</p>
                <p class="text-2xl font-bold text-indigo-600">$${(totalCompras / comprasData.length).toFixed(2)}</p>
            </div>
        </div>
    `;
}

function generateInventoryReport(contentDiv, summaryDiv) {
    console.log('Generando reporte de inventario - Datos:', inventarioData);
    
    if (inventarioData.length === 0) {
        console.warn('No hay productos en el inventario');
        contentDiv.innerHTML = '<p class="text-gray-500">No hay productos en el inventario</p>';
        return;
    }

    let totalItems = 0;

    contentDiv.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${inventarioData.map(item => {
                    totalItems += item.cantidad;
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${item.producto}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${item.cantidad}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    console.log('Total de productos:', inventarioData.length);
    console.log('Total de items:', totalItems);

    summaryDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Total Productos</p>
                <p class="text-2xl font-bold text-indigo-600">${inventarioData.length}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Total Items en Stock</p>
                <p class="text-2xl font-bold text-indigo-600">${totalItems}</p>
            </div>
        </div>
    `;
}

function generateProfitReport(contentDiv, summaryDiv) {
    console.log('Generando reporte de ganancias');
    console.log('Datos de ventas:', ventasData);
    console.log('Datos de compras:', comprasData);

    const totalVentas = ventasData.reduce((sum, venta) => sum + venta.total, 0);
    const totalCompras = comprasData.reduce((sum, compra) => sum + compra.total, 0);
    const ganancia = totalVentas - totalCompras;

    console.log('Total de ventas:', totalVentas);
    console.log('Total de compras:', totalCompras);
    console.log('Ganancia:', ganancia);

    contentDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="text-lg font-semibold mb-4">Resumen de Ventas</h4>
                <p class="text-sm text-gray-600 mb-2">Total Ventas: $${totalVentas.toFixed(2)}</p>
                <p class="text-sm text-gray-600">Número de Ventas: ${ventasData.length}</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="text-lg font-semibold mb-4">Resumen de Compras</h4>
                <p class="text-sm text-gray-600 mb-2">Total Compras: $${totalCompras.toFixed(2)}</p>
                <p class="text-sm text-gray-600">Número de Compras: ${comprasData.length}</p>
            </div>
        </div>
    `;

    summaryDiv.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg">
            <h4 class="text-lg font-semibold mb-4">Ganancia Total</h4>
            <p class="text-3xl font-bold ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}">
                $${ganancia.toFixed(2)}
            </p>
        </div>
    `;
}

function generateCompleteReport(contentDiv, summaryDiv) {
    contentDiv.innerHTML = `
        <div class="space-y-8">
            <div>
                <h4 class="text-lg font-semibold mb-4">Resumen de Ventas</h4>
                <div id="salesReportSection"></div>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">Resumen de Compras</h4>
                <div id="purchasesReportSection"></div>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">Estado del Inventario</h4>
                <div id="inventoryReportSection"></div>
            </div>
        </div>
    `;

    generateSalesReport(document.getElementById('salesReportSection'), document.createElement('div'));
    generatePurchasesReport(document.getElementById('purchasesReportSection'), document.createElement('div'));
    generateInventoryReport(document.getElementById('inventoryReportSection'), document.createElement('div'));
    generateProfitReport(document.createElement('div'), summaryDiv);
}

// Function to populate invoice sales dropdown
function populateVentasFactura() {
    console.log('Actualizando lista de ventas para facturación...'); // Debug log
    const ventaSelect = document.getElementById('ventaFactura');
    if (!ventaSelect) {
        console.error('No se encontró el elemento ventaFactura');
        return;
    }

    console.log('Ventas disponibles:', ventasData); // Debug log

    // Limpiar opciones existentes
    ventaSelect.innerHTML = '<option value="">Seleccione una venta</option>';

    // Agregar ventas al dropdown en orden inverso (más recientes primero)
    ventasData.slice().reverse().forEach((venta, index) => {
        const option = document.createElement('option');
        option.value = ventasData.length - 1 - index; // Ajustar el índice para mantener la referencia correcta
        option.textContent = `Venta del ${venta.fecha} - ${venta.cliente} - ${venta.producto} - $${venta.total.toFixed(2)}`;
        ventaSelect.appendChild(option);
    });

    // Remover evento anterior si existe
    ventaSelect.removeEventListener('change', actualizarVistaPrevia);
    // Agregar evento para actualizar la vista previa
    ventaSelect.addEventListener('change', actualizarVistaPrevia);
}

// Function to update invoice preview
function actualizarVistaPrevia() {
    const ventaSelect = document.getElementById('ventaFactura');
    const facturaPreview = document.getElementById('facturaPreview');
    const numeroFactura = document.getElementById('numeroFactura').value;
    const fechaEmision = document.getElementById('fechaEmision').value;

    if (!ventaSelect || !facturaPreview) return;

    const ventaIndex = ventaSelect.value;
    if (!ventaIndex) {
        facturaPreview.innerHTML = '<p class="text-gray-500">Seleccione una venta para ver la vista previa</p>';
        return;
    }

    const venta = ventasData[ventaIndex];
    const cliente = clientesData.find(c => c.nombre === venta.cliente);

    if (!cliente) {
        facturaPreview.innerHTML = '<p class="text-red-500">Error: No se encontraron los datos del cliente</p>';
        return;
    }

    facturaPreview.innerHTML = `
        <div class="space-y-4">
            <!-- Encabezado de Factura -->
            <div class="text-center border-b pb-4">
                <h2 class="text-xl font-bold">FACTURA</h2>
                <p class="text-sm text-gray-600">N°: ${numeroFactura || 'Sin número'}</p>
                <p class="text-sm text-gray-600">Fecha: ${fechaEmision || new Date().toLocaleDateString()}</p>
            </div>

            <!-- Datos del Cliente -->
            <div class="border-b pb-4">
                <h3 class="font-semibold mb-2">Datos del Cliente:</h3>
                <p>Nombre: ${cliente.nombre}</p>
                <p>CUIT: ${cliente.cuit}</p>
                <p>Dirección: ${cliente.direccion}</p>
                <p>Email: ${cliente.email}</p>
                <p>Teléfono: ${cliente.telefono}</p>
            </div>

            <!-- Detalles de la Venta -->
            <div class="border-b pb-4">
                <h3 class="font-semibold mb-2">Detalles de la Venta:</h3>
                <table class="w-full">
                    <thead>
                        <tr class="text-left text-sm text-gray-600">
                            <th class="pb-2">Producto</th>
                            <th class="pb-2">Cantidad</th>
                            <th class="pb-2">Precio Unit.</th>
                            <th class="pb-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${venta.producto}</td>
                            <td>${venta.cantidad}</td>
                            <td>$${venta.precio.toFixed(2)}</td>
                            <td>$${venta.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Total -->
            <div class="text-right">
                <p class="text-lg font-bold">Total: $${venta.total.toFixed(2)}</p>
            </div>
        </div>
    `;
}

// Function to generate invoice
function generarFactura() {
    const ventaSelect = document.getElementById('ventaFactura');
    const numeroFactura = document.getElementById('numeroFactura').value;

    if (!ventaSelect.value) {
        showNotification('Por favor seleccione una venta');
        return;
    }

    if (!numeroFactura) {
        showNotification('Por favor ingrese un número de factura');
        return;
    }

    actualizarVistaPrevia();
    showNotification('Factura generada correctamente');
}

// Function to print invoice
function imprimirFactura() {
    const facturaPreview = document.getElementById('facturaPreview');

    if (!facturaPreview.innerHTML || facturaPreview.innerHTML.includes('Seleccione una venta')) {
        showNotification('Por favor genere una factura primero');
        return;
    }

    // Crear una ventana de impresión
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Factura</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="p-8">
                ${facturaPreview.innerHTML}
            </body>
        </html>
    `);

    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando datos y eventos...');
    
    console.log('Datos iniciales cargados:');
    console.log('Clientes:', clientesData);
    console.log('Productos:', inventarioData);
    console.log('Proveedores:', proveedoresData);
    
    // Inicializar menús desplegables
    populateClientesDropdown();
    populateProductosDropdown();
    populateProveedoresDropdown();
    
    // Inicializar vistas
    updateClientesView();
    updateInventarioView();
    updateProveedoresView();
    updateVentasView();
    updateComprasView();
    
    // Inicializar la fecha de emisión con la fecha actual
    const fechaEmision = document.getElementById('fechaEmision');
    if (fechaEmision) {
        fechaEmision.valueAsDate = new Date();
    }

    // Inicializar el dropdown de ventas para facturación
    populateVentasFactura();
    
    // Logging de datos iniciales
    console.log('Datos de ventas iniciales:', ventasData);
    console.log('Datos de compras iniciales:', comprasData);
    console.log('Datos de inventario iniciales:', inventarioData);
    console.log('Datos de clientes iniciales:', clientesData);
    console.log('Datos de proveedores iniciales:', proveedoresData);

    // Event listener para el formulario de clientes
    const clienteForm = document.getElementById('ClienteForm');
    if (clienteForm) {
        clienteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const nombre = document.getElementById('nombre-Cliente').value;
            const cuit = document.getElementById('cuit-Cliente').value;
            const telefono = document.getElementById('telefono-Cliente').value;
            const email = document.getElementById('email-Cliente').value;
            const direccion = document.getElementById('direccion-Cliente').value;
            
            // Agregar cliente a la lista
            clientesData.push({ nombre, cuit, telefono, email, direccion });
            
            // Guardar en localStorage
            localStorage.setItem('clientesData', JSON.stringify(clientesData));
            
            // Actualizar vista de clientes
            updateClientesView();
            
            // Actualizar menú desplegable de clientes
            populateClientesDropdown();
            
            // Limpiar formulario y mostrar notificación
            event.target.reset();
            showNotification('Cliente registrado correctamente');
        });
    }

    // Event listener para el formulario de inventario
    const inventarioForm = document.getElementById('inventoryForm');
    if (inventarioForm) {
        inventarioForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nombreProducto = document.getElementById('Producto-inv').value;
            const cantidad = parseInt(document.getElementById('cantidad-inv').value);
            
            // Agregar producto al inventario
            inventarioData.push({
                producto: nombreProducto,
                cantidad: cantidad
            });
            
            // Guardar en localStorage
            localStorage.setItem('inventarioData', JSON.stringify(inventarioData));
            
            // Actualizar vistas
            updateInventarioView();
            populateProductosDropdown();
            event.target.reset();
            showNotification('Producto registrado correctamente');
        });
    }

    // Event listener para el formulario de proveedores
    const proveedorForm = document.getElementById('ProveedorForm');
    if (proveedorForm) {
        proveedorForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nombreProveedor = document.getElementById('nombre-Proveedor').value;
            const cuitProveedor = document.getElementById('cuit-Proveedor').value;
            const telefonoProveedor = document.getElementById('telefono-Proveedor').value;
            const emailProveedor = document.getElementById('email-Proveedor').value;
            const direccionProveedor = document.getElementById('direccion-Proveedor').value;

            // Crear objeto proveedor con todos los datos
            const nuevoProveedor = {
                nombre: nombreProveedor,
                cuit: cuitProveedor,
                telefono: telefonoProveedor,
                email: emailProveedor,
                direccion: direccionProveedor
            };

            // Agregar proveedor al array
            proveedoresData.push(nuevoProveedor);

            // Guardar en localStorage
            localStorage.setItem('proveedoresData', JSON.stringify(proveedoresData));

            // Actualizar vistas
            updateProveedoresView();
            populateProveedoresDropdown();

            // Limpiar formulario y mostrar notificación
            event.target.reset();
            showNotification('Proveedor registrado correctamente');
        });
    }

    // Event listener para el formulario de ventas
    const ventasForm = document.getElementById('ventasForm');
    if (ventasForm) {
        ventasForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fecha = document.getElementById('fechaVenta').value;
            const cliente = document.getElementById('Cliente').value;
            const producto = document.getElementById('Producto').value;
            const cantidad = parseInt(document.getElementById('cantidad').value, 10);
            const precio = parseFloat(document.getElementById('precioVenta').value);

            if (!producto) {
                showNotification('Por favor seleccione un producto');
                return;
            }

            if (!cliente) {
                showNotification('Por favor seleccione un cliente');
                return;
            }

            if (!procesarVenta(producto, cantidad)) {
                return;
            }

            const total = cantidad * precio;
            const venta = {
                fecha,
                cliente,
                producto,
                cantidad,
                precio,
                total
            };
            
            ventasData.push(venta);
            
            // Guardar en localStorage
            localStorage.setItem('ventasData', JSON.stringify(ventasData));

            // Actualizar las vistas
            updateVentasView();
            populateVentasFactura(); // Actualizar lista de ventas en facturación

            event.target.reset();
            showNotification('Venta registrada correctamente');
        });
    }

    // Event listener para el formulario de compras
    const comprasForm = document.getElementById('comprasForm');
    if (comprasForm) {
        comprasForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fecha = document.getElementById('fechaCompra').value;
            const proveedor = document.getElementById('Proveedor').value;
            const producto = document.getElementById('ProductoCompra').value;
            const cantidad = parseInt(document.getElementById('cantidadCompra').value, 10);
            const precio = parseFloat(document.getElementById('precioCompra').value);

            if (!proveedor) {
                showNotification('Por favor seleccione un proveedor');
                return;
            }

            if (!producto) {
                showNotification('Por favor ingrese un producto');
                return;
            }

            // Procesar la compra y actualizar inventario
            if (!procesarCompra(producto, cantidad)) {
                return;
            }

            const total = cantidad * precio;
            const compra = {
                fecha,
                proveedor,
                producto,
                cantidad,
                precio,
                total
            };
            
            comprasData.push(compra);
            
            // Guardar en localStorage
            localStorage.setItem('comprasData', JSON.stringify(comprasData));

            // Actualizar vistas
            updateComprasView();

            event.target.reset();
            showNotification('Compra registrada correctamente');
        });
    }
});

// Agregar evento para guardar datos en localStorage antes de cerrar
document.addEventListener('beforeunload', function() {
    localStorage.setItem('libroDiarioData', JSON.stringify(libroDiarioData));
    localStorage.setItem('libroMayorData', JSON.stringify(libroMayorData));
    localStorage.setItem('ventasData', JSON.stringify(ventasData));
    localStorage.setItem('comprasData', JSON.stringify(comprasData));
    localStorage.setItem('inventarioData', JSON.stringify(inventarioData));
    localStorage.setItem('clientesData', JSON.stringify(clientesData));
    localStorage.setItem('proveedoresData', JSON.stringify(proveedoresData));
});