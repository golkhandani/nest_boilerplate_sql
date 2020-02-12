export const jwtConstants = {
    secret: 'secretKey',
    expirationInterval: 15, // day
    expiresIn: '12h',
    algorithm: 'RS256',
    public_key:
        `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAeW5tiNhYWD5KGLrU0VZ1h46yOGGz0ERH
NZeSve3cBqgKRb94mMZR+pFUsjMGf232kJBeTNDrP3H/mo9199MyCQIDAQAB
-----END PUBLIC KEY-----`,
    private_key:
        `-----BEGIN RSA PRIVATE KEY-----
MIIBOAIBAAJAeW5tiNhYWD5KGLrU0VZ1h46yOGGz0ERHNZeSve3cBqgKRb94mMZR
+pFUsjMGf232kJBeTNDrP3H/mo9199MyCQIDAQABAkAxXEIKLmc695cHFmsL7Sk5
QTgQ0yZUsmx/zG1J5zZZPcKiNwWZo9JHudP0B9HXGilkEljdKRI3ATWnx61jhPRB
AiEA24rGtpZLCB66QMrYUF/G56uKJ+g0/g0hRq/nK4SFq+sCIQCNmL7fEBM8hmP1
LG4uhe/uxu3y5lvRNm8LPgR+T8Ng2wIgLD+vR3PJUayny5FWwfRb6au4X8y8iYvp
7g5cIHhIXNsCID3erCgTghRENJEAZPR3GaufyIEGHsB/pG2pH5WBjMFZAiAlmLra
rX9oKG5xCeufYov05gmA3IrJOyZItPoLLmrQXw==
-----END RSA PRIVATE KEY-----`,
    general_key: 'secret_key',
};
export const bcryptConstants = {
    saltRounds: 10,
};
export const phoneConstants = {
    expirationInterval: 15, // min
};
export const kavenegarConstants = {
    apiKey: '1234',
    timeout: 10000, // ms
    sender: 100400,
    template: 'voices-verification',
};
