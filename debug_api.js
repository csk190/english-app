const fs = require('fs');

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/generate/passage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: 'Artificial Intelligence',
                difficulty: 'Intermediate',
                length: 'Medium'
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.log('Error occurred, writing to error.log');
            fs.writeFileSync('error.log', errorBody);
        } else {
            console.log('Success');
        }
    } catch (error) {
        console.error('Error:', error);
        fs.writeFileSync('error.log', String(error));
    }
}

testApi();
