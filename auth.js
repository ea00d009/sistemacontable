// Clase para manejo de autenticación
class AuthManager {
    constructor() {
        // Inicializar usuarios desde localStorage o con valores predeterminados
        this.users = JSON.parse(localStorage.getItem('systemUsers')) || [
            {
                username: 'admin',
                password: this.hashPassword('admin123'),
                role: 'administrador',
                email: 'admin@empresa.com'
            },
            {
                username: 'empleado',
                password: this.hashPassword('empleado123'),
                role: 'empleado',
                email: 'empleado@empresa.com'
            }
        ];
    }

    // Método para hashear contraseñas (simple hash para demostración)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32-bit integer
        }
        return hash.toString();
    }

    // Método para validar credenciales
    validateCredentials(username, password) {
        const hashedPassword = this.hashPassword(password);
        const user = this.users.find(u => 
            u.username === username && u.password === hashedPassword
        );
        return user ? user : null;
    }

    // Método para registrar nuevo usuario
    registerUser(username, password, email, role) {
        // Validar que el usuario no exista
        if (this.users.some(u => u.username === username)) {
            throw new Error('El nombre de usuario ya existe');
        }

        const newUser = {
            username,
            password: this.hashPassword(password),
            email,
            role
        };

        this.users.push(newUser);
        localStorage.setItem('systemUsers', JSON.stringify(this.users));
        return newUser;
    }

    // Método para iniciar sesión
    login(username, password) {
        const user = this.validateCredentials(username, password);
        if (user) {
            // Crear token de sesión
            const sessionToken = this.generateSessionToken();
            
            // Guardar información de sesión
            sessionStorage.setItem('userSession', JSON.stringify({
                username: user.username,
                role: user.role,
                token: sessionToken,
                loginTime: Date.now()
            }));

            return user;
        }
        return null;
    }

    // Método para cerrar sesión
    logout() {
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }

    // Método para generar token de sesión
    generateSessionToken() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, 
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Método para verificar si hay una sesión activa
    isLoggedIn() {
        const session = sessionStorage.getItem('userSession');
        if (!session) return false;

        const userSession = JSON.parse(session);
        // Opcional: Añadir expiración de sesión (ej. 8 horas)
        const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
        return (Date.now() - userSession.loginTime) < SESSION_DURATION;
    }

    // Método para obtener el rol del usuario actual
    getCurrentUserRole() {
        const session = sessionStorage.getItem('userSession');
        return session ? JSON.parse(session).role : null;
    }

    // Método para redirigir según el rol
    redirectToAppropriateInterface() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        const role = this.getCurrentUserRole();
        switch(role) {
            case 'administrador':
                window.location.href = 'administrador.html';
                break;
            case 'empleado':
                window.location.href = 'empleados.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }
}

// Crear instancia global
const authManager = new AuthManager();
