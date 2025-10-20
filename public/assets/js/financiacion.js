// Financiación Chat
let conversacionId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarPlanes();
    inicializarChat();
});

// Cargar planes de financiamiento
async function cargarPlanes() {
    try {
        const response = await fetch('/api/financiamiento/planes');
        const planes = await response.json();
        
        const planesGrid = document.getElementById('planesGrid');
        planesGrid.innerHTML = planes.map(plan => `
            <div class="plan-card">
                <h3>${plan.nombre}</h3>
                <p>${plan.descripcion}</p>
                <div class="plan-rate">${plan.tasa_interes_anual}% TNA</div>
                <div class="plan-details">
                    ${plan.plazo_minimo_meses}-${plan.plazo_maximo_meses} meses
                    • Anticipo desde ${plan.anticipo_minimo_porcentaje}%
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando planes:', error);
    }
}

// Inicializar chat
function inicializarChat() {
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });
    
    sendBtn.addEventListener('click', enviarMensaje);
}

// Enviar mensaje
async function enviarMensaje() {
    const input = document.getElementById('userInput');
    const mensaje = input.value.trim();
    
    if (!mensaje) return;
    
    // Agregar mensaje del usuario
    agregarMensaje(mensaje, 'user');
    input.value = '';
    
    // Mostrar indicador de escritura
    mostrarTyping();
    
    try {
        const response = await fetch('/api/financiamiento/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversacion_id: conversacionId,
                mensaje: mensaje
            })
        });
        
        const data = await response.json();
        
        // Guardar ID de conversación
        if (data.conversacion_id) {
            conversacionId = data.conversacion_id;
        }
        
        // Ocultar typing y mostrar respuesta
        ocultarTyping();
        agregarMensaje(data.respuesta, 'bot');
        
    } catch (error) {
        console.error('Error:', error);
        ocultarTyping();
        agregarMensaje('Lo siento, hubo un error. Por favor intenta de nuevo.', 'bot');
    }
}

// Agregar mensaje al chat
function agregarMensaje(texto, tipo) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;
    messageDiv.innerHTML = `<div class="message-content">${texto}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar indicador de escritura
function mostrarTyping() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Ocultar indicador de escritura
function ocultarTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

