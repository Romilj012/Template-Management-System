import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { getSuggestions } from "../services/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function LLMAssistant({ context, onApplySuggestion }) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState("");

    const handleGetSuggestions = async () => {
        setLoading(true);
        try {
            const response = await getSuggestions(context);
            setSuggestions(response.suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            bgcolor: '#f5f5f5',
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
            <Button 
                variant="contained" 
                onClick={handleGetSuggestions}
                sx={{ mb: 2 }}
            >
                Get Suggestions
            </Button>
            
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}
            
            {suggestions && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Suggestions:
                    </Typography>
                    <Box sx={{ 
                        bgcolor: 'white',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        '& code': {
                            backgroundColor: '#f5f5f5',
                            padding: '2px 4px',
                            borderRadius: '4px'
                        },
                        '& pre': {
                            backgroundColor: '#f5f5f5',
                            padding: '16px',
                            borderRadius: '4px',
                            overflow: 'auto'
                        },
                        '& h1, & h2, & h3': {
                            fontWeight: 'bold',
                            mt: 2,
                            mb: 1
                        },
                        '& ul, & ol': {
                            pl: 3
                        }
                    }}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {suggestions}
                        </ReactMarkdown>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default LLMAssistant;