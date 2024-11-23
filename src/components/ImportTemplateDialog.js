// //working 11/19 10:54
// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   CircularProgress,
//   Typography,
//   Alert
// } from '@mui/material';
// import { unpackTemplate } from '../services/templatePackager';
// import { createUsecase, updateUsecase } from '../services/api';

// function ImportTemplateDialog({ open, onClose, onSuccess, usecaseId }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const validateFile = (file) => {
//     if (!file) {
//       throw new Error('Please select a file');
//     }

//     if (!file.name.endsWith('.zip')) {
//       throw new Error('Please select a valid .zip template file');
//     }

//     const maxSize = 10 * 1024 * 1024; // 10MB
//     if (file.size > maxSize) {
//       throw new Error('File size exceeds 10MB limit');
//     }
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     setError(null);
//   };

//   const handleImport = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Validate file
//       validateFile(selectedFile);

//       // Unpack the template first to validate its structure
//       const templateData = await unpackTemplate(selectedFile);
      
//       if (!templateData) {
//         throw new Error('Failed to unpack template file');
//       }

//       // Create or update the usecase
//       let response;
//       if (usecaseId) {
//         response = await updateUsecase(usecaseId, selectedFile);
//       } else {
//         response = await createUsecase(selectedFile);
//       }

//       if (!response) {
//         throw new Error(`Failed to ${usecaseId ? 'update' : 'create'} usecase`);
//       }

//       onSuccess(response);
//       onClose();
//     } catch (err) {
//       console.error('Error importing template:', err);
//       setError(err.message || `Failed to ${usecaseId ? 'update' : 'import'} template`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setSelectedFile(null);
//     setError(null);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <DialogTitle>{usecaseId ? 'Update' : 'Import'} Template</DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <div className="flex justify-center items-center p-4">
//             <CircularProgress />
//             <Typography variant="body2" sx={{ ml: 2 }}>
//               Processing template...
//             </Typography>
//           </div>
//         ) : (
//           <div className="space-y-4 p-4">
//             <input
//               type="file"
//               accept=".zip"
//               onChange={handleFileSelect}
//               style={{ display: 'none' }}
//               id="template-file-input"
//             />
//             <label htmlFor="template-file-input">
//               <Button variant="contained" component="span" fullWidth>
//                 {selectedFile ? selectedFile.name : 'Choose Template File'}
//               </Button>
//             </label>
            
//             {selectedFile && (
//               <Typography variant="body2" color="textSecondary">
//                 File size: {(selectedFile.size / 1024).toFixed(1)} KB
//               </Typography>
//             )}
            
//             {error && (
//               <Alert severity="error" sx={{ mt: 2 }}>
//                 {error}
//               </Alert>
//             )}
//           </div>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button 
//           onClick={handleImport}
//           disabled={!selectedFile || loading}
//           variant="contained"
//           color="primary"
//         >
//           {usecaseId ? 'Update' : 'Import'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default ImportTemplateDialog;



// // import React, { useState } from 'react';
// // import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography, Alert } from '@mui/material';
// // import { unpackTemplate } from '../services/templatePackager';
// // import { importTemplate, updateTemplateWithImport } from '../services/api';

// // function ImportTemplateDialog({ open, onClose, onSuccess, templateId }) {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [selectedFile, setSelectedFile] = useState(null);

// //   const validateFile = (file) => {
// //     if (!file) {
// //       throw new Error('Please select a file');
// //     }
// //     if (!file.name.endsWith('.zip')) {
// //       throw new Error('Please select a valid .zip template file');
// //     }
// //     const maxSize = 10 * 1024 * 1024; // 10MB
// //     if (file.size > maxSize) {
// //       throw new Error('File size exceeds 10MB limit');
// //     }
// //   };

// //   const handleFileSelect = (event) => {
// //     const file = event.target.files[0];
// //     setSelectedFile(file);
// //     setError(null);
// //   };

// //   // const handleImport = async () => {
// //   //   try {
// //   //     setLoading(true);
// //   //     setError(null);

// //   //     validateFile(selectedFile);

// //   //     const templateData = await unpackTemplate(selectedFile);
// //   //     if (!templateData) {
// //   //       throw new Error('Failed to unpack template file');
// //   //     }

// //   //     let response;
// //   //     if (templateId) {
// //   //       response = await updateTemplateWithImport(templateId, selectedFile);
// //   //     } else {
// //   //       response = await importTemplate(selectedFile);
// //   //     }

// //   //     if (!response) {
// //   //       throw new Error(`Failed to ${templateId ? 'update' : 'import'} template`);
// //   //     }

// //   //     onSuccess(response.data);
// //   //     onClose();
// //   //   } catch (err) {
// //   //     console.error('Error importing template:', err);
// //   //     setError(err.message || `Failed to ${templateId ? 'update' : 'import'} template`);
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   const handleImport = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
  
// //       validateFile(selectedFile);
  
// //       const response = await importTemplate(selectedFile);
// //       onSuccess(response.data);
// //       onClose();
// //     } catch (err) {
// //       console.error('Error importing template:', err);
// //       if (err.response) {
// //         console.error('Error response:', err.response.data);
// //         setError(`Import failed: ${err.response.data.detail}`);
// //       } else {
// //         setError('Failed to import template');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
// //       <DialogTitle>{templateId ? 'Update' : 'Import'} Template</DialogTitle>
// //       <DialogContent>
// //         {loading ? (
// //           <CircularProgress />
// //         ) : (
// //           <>
// //             <input
// //               type="file"
// //               accept=".zip"
// //               onChange={handleFileSelect}
// //               style={{ display: 'none' }}
// //               id="template-file-input"
// //             />
// //             <label htmlFor="template-file-input">
// //               <Button variant="contained" component="span">
// //                 Choose Template File
// //               </Button>
// //             </label>
// //             {selectedFile && (
// //               <Typography variant="body2">
// //                 Selected file: {selectedFile.name}
// //               </Typography>
// //             )}
// //             {error && <Alert severity="error">{error}</Alert>}
// //           </>
// //         )}
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose}>Cancel</Button>
// //         <Button onClick={handleImport} disabled={!selectedFile || loading}>
// //           {templateId ? 'Update' : 'Import'}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // }

// // export default ImportTemplateDialog;