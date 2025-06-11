const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 사용자 라우트
app.use('/api/users', userRoutes);

// Swagger 문서 UI 라우트 (정적 파일 서빙 X)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
