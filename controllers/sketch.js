const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Multer setup for file uploads
const upload = multer({ dest: 'public/uploads/' });

exports.upload = upload.single('sketch');

exports.processSketch = async (req, res) => {
    try {

        // Convert uploaded image to base64
        const filePath = path.join(__dirname, '../', req.file.path);
        const imageData = fs.readFileSync(filePath).toString('base64');

        // Call OpenAI API with a prompt describing the image data
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant that describes sketches based on image data.'
                    },
                    {
                        role: 'user',
                        content: `Here is an image encoded in base64: ${imageData}. Describe what the sketch might depict.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const description = openaiResponse.data.choices[0].message.content;

        // Render result page with the sketch description
        res.render('result', { description, imagePath: req.file.filename });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error processing sketch.');
    }
};