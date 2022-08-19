const admin = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "prueba-dev-crud",
    "private_key_id": "dc8047d677630aba7dd05cc69581597e7fb76581",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnqrdjv5M01qOf\n5r0d6vPeLP2pLrqoWGQBRu1XhQvMhSvrObuGiGb6/ssj8EluwD9pz2On1/1cEOAj\nKROOFjxYKmiVr/RByZFgqJfXSQdS9qHBXM/fGaOHNX60I1LHCf9Gr6mRPZFIAND9\n4w6pq0wQhFDtWVr6q8rwoz5pNk0DMANyfkNhKy5uF2SNso/qsGZsqLzUpNkpBvkD\nUxXErA9+eYsevzPiJwQNC6T7hMsCrbUp8qX2VXARyT1erT2SzwOT6+IVsvkyhmu0\nNmD46Zec1Tyc4fKLAqFSnyfO4YHrBZPlaGa5OrmomuQKHu8j8s54ZkLzxoDKPGeK\nvsZ/tGdXAgMBAAECggEAT4T2WQtXvKHWXVsm3B+bYM5hrZJoKMPaY+PUMR/uil/F\n0QKqn0Wvz4To9qeSlSzxN2EkDGdjxJfYT8lYOIPiZ8L6zjKs7W4CdEK6h/+9v1j/\n8e7pPWPAEXeny656Se7hDILcegm/lg8NrbAkBtJRFDRO0QHEbFnOmaX3FMc6TRal\nOHzU1xYHCZTRyjRvgzXElHOn/Y3zWDUZ9dmlwKBXLf6QpuxtWUnBL+6pKt2Z0bwS\nLq1uVjvrXkB0a5aPxQu4i7iEet36e5z8PkQwsmB8mTAWSgvY7uJnV4CF+YT0En35\npEyk2X/6oysYL08Ov+sQrvE+lPsTzUFNd3jYa8dZ/QKBgQD75ED8kAPOBaFWvLd1\nyzYMkZsb59Pp5ZxZIGSqgyvOyEBqFcIbzd5GqENzqTyMhxqQdoMTWF4c6VpL7Vvb\nHGge34gpJurfa7p+08GnbWrZ2BY+aLG+93evA9oF3Ba/WbsO/9a79eJotRWq5rQE\n+nWlFX978S5alDIQcgcTdvSQ+wKBgQDrcgQoCmQsUf+g//636sj73voG8eGFrt+O\n8qJzQ6mB94fPHyIiDp2eRGEIBdyx3HudtTihMWogKuwDfyItE9P4W9FfY92lFCiW\nyhyqlcZeHIv4hJwM691+roX6sULEcK/LXVdAZF53L8IRfcisnndynezJKIz5/XgN\nhAQ8s/WMVQKBgG7GCYJIfzPaLAKuCWxHCqTqX7Ec+YeyD1jusvZ9qwVL8W/106BQ\nn8Co/Mjfkx4lyBvh0nDueqzyPmCHqM6qJmv1V7bpQ38vrBtcWpybtNLKgbW+avSV\ndc/EvNu411QdTPMitbeBQalUgYvf2ykZUCViV+cUwJLa+01aKBx6QsGDAoGABZji\nTGli1ELmxtcPISQtvv8gBoY9jEYJ/oX6Iq9bGkHeMqhU0WZzjM2nWN96zaemMKuc\nOwjHsxgSIEsnbtbn1SGpqpDfNgtyo5MOd2e0HYykLzZH127MBzTy7nDEW5MqOrVv\nW5KHRGIYRP4uhRwHTuw+MtIJ9+90qS2YRDErBzkCgYEA8Y4Cr1PBdbgM/bgkNuq8\nYjrQ8g5BKPNhm1UeKzAaWfu1GUCWE9PMV9E/91pIcYR1DJDysfq+M2iY8G3LUgWj\n+0lEeLCdjqSOS61fmun7+HD9YI435Vh+2CLVMhqR5QQh43I51VRhLaNZC6LuJlhM\nFMLnA7quYvdDBSI9b4gZk1o=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-nsnbu@prueba-dev-crud.iam.gserviceaccount.com",
    "client_id": "110366381436079984594",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nsnbu%40prueba-dev-crud.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://prueba-dev-crud-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();


function adminConnection() {
    try {
        return admin.auth();
    } catch (error) {
        return error
    }
}

async function signup(userResponse) {

    const data = {
        "username": userResponse.username,
        "email": userResponse.email,
        "password": userResponse.password,
    }

    const addUser = await auth.createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.username,
        disabled: false,
    })
        .then((userRecord) => {
            db.collection('users').doc(userRecord.uid).set(data);
            return "success"
        })
        .catch((error) => {
            return error
        });

    return addUser
}

async function getCurrentUser(email) {
    
    const user = await auth.getUserByEmail(email)
        .then((userRecord) => {            
            return userRecord.displayName;
        })
        .catch((error) => {
            return "Username";
        });

    return user;
}

module.exports = { adminConnection, signup, getCurrentUser }