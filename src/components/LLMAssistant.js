import React, { useState } from "react";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import { getSuggestions } from "../services/api";

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
        <div>
            <Button variant="contained" onClick={handleGetSuggestions}>
                Get Suggestions
            </Button>
            {loading && <CircularProgress />}
            {suggestions && (
                <div>
                    <Typography variant="h6">Suggestions:</Typography>
                    <Typography>{suggestions}</Typography>
                    <Button onClick={() => onApplySuggestion(suggestions)}>Apply</Button>
                </div>
            )}
        </div>
    );
}

export default LLMAssistant;
