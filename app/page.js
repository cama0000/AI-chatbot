'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello, I am your Headstarter assistant? Is there anything I can help with?" }
  ]);


// const sendMessage = async () => {
//   if(message.trim()){
//       const userMessage = { role: "user", content: message };
//       setMessages(prevMessages => [...prevMessages, userMessage]);
//       setMessage("");

//       try {
//           const response = await fetch('/api/chat', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ message }),
//           });

//           if (response.ok) {
//               const reader = response.body.getReader();
//               const decoder = new TextDecoder();
//               let result = '';

//               while (true) {
//                   const { done, value } = await reader.read();
//                   if (done) break;
//                   result += decoder.decode(value);
//               }

//               setMessages(prevMessages => [...prevMessages, { role: "assistant", content: result }]);

//           }
//           else{
//               console.error('RESPONSE ERROR:', response.statusText);
//           }
//       } catch (error) {
//           console.error('MESSAGE SEND ERROR:', error);
//       }
//   }
// };

const sendMessage = async () => {
  if(message.trim()){
      const userMessage = { role: "user", content: message };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setMessage("");

      try{
          const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message }),
          });

          if (response.ok) {
              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let result = '';

              while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  result += decoder.decode(value, { stream: true });
              }

              setMessages(prevMessages => [...prevMessages, { role: "assistant", content: result }]);

          } else {
              console.error('RESPONSE ERROR:', response.statusText);
          }
      } catch (error) {
          console.error('MESSAGE SEND ERROR:', error);
      }
  }
};

  const [message, setMessage] = useState('');

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid white"
        p={2}
        spacing={3}
      >
        <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight="100vw">
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                px={2}
                py={1}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>

          <TextField
      label="Message"
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      sx={{
        '& .MuiInputBase-root': {
          backgroundColor: 'white',
        },
        '& .MuiInputLabel-root': {
          color: 'black',
        },
      }}
    />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
