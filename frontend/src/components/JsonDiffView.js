import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ReactDiffViewer from 'react-diff-viewer';
import { getTemplateDiff } from '../services/api';

const JsonDiffView = ({ templateId, version1, version2 }) => {
    const [diff, setDiff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiff = async () => {
            try {
                const response = await getTemplateDiff(templateId, version1, version2);
                setDiff(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch diff:', err);
                setError('Error fetching differences');
                setLoading(false);
            }
        };

        if (version1 && version2) {
            fetchDiff();
        }
    }, [templateId, version1, version2]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!diff) return <Typography>No differences found.</Typography>;

    return (
        <Box sx={{ mt: 2, backgroundColor: '#1e1e1e' }}>
            <ReactDiffViewer
                oldValue={JSON.stringify(diff.oldVersion, null, 2)}
                newValue={JSON.stringify(diff.newVersion, null, 2)}
                splitView={true}
                leftTitle={`Version ${version1}`}
                rightTitle={`Version ${version2}`}
                useDarkTheme={true}
                hideLineNumbers={false}
                styles={{
                    contentText: {
                        fontSize: '13px',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    },
                    gutter: {
                        background: '#2a2a2a',
                    },
                    diffContainer: {
                        borderColor: '#444',
                    },
                }}
            />
        </Box>
    );
};

export default JsonDiffView;