---
title: layers-travel
date: 2025-09-05
categories: [machine-learning, visualization, neural-networks]
tags: [embeddings, pca, 3d-visualization, plotly]
description: "Interactive 3D visualization of how neural network embeddings evolve across layers"
---

# 3D Layer-wise Embedding Evolution

This visualization shows how neural network embeddings evolve across different layers. Each point represents a text sample positioned in 2D PCA space, with the Z-axis representing the layer index. Trajectory lines connect the same text samples across layers, revealing how the embedding space transforms through the network.

## Features

- **Interactive 3D Plot**: Rotate, zoom, and pan to explore the embedding space
- **Layer Evolution**: See how embeddings change from input to output layers
- **Category Visualization**: Different colors for different categories with legend
- **Trajectory Tracking**: Lines show how individual samples move through embedding space
- **Adjustable Z-separation**: Control the spacing between layers

## Datasets

The visualization includes three datasets:
- **Sentiment Analysis**: Positive, negative, and neutral sentiment classifications
- **Academic Subjects**: Science, mathematics, and literature texts
- **Scientific Domains**: Astronomy, biology, and physics research topics

<div id="embedding-visualization">
<style>
body {
    font-family: Arial, sans-serif;
}
.viz-container {
    max-width: 100%;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 20px 0;
}
.controls {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}
.controls select, .controls input[type="range"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.controls button {
    padding: 8px 16px;
    background: #007cba;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.controls button:hover {
    background: #005a87;
}
#plot {
    width: 100%;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.info {
    margin-bottom: 10px;
    padding: 10px;
    background: #e8f4f8;
    border-radius: 4px;
    font-size: 14px;
}
#loadStatus {
    margin-left: 10px;
    font-weight: bold;
}
</style>

<div class="viz-container">
    <div class="controls">
        <select id="datasetSelect" style="display: none;">
            <option value="">Select Dataset</option>
        </select>
        <label>
            Z-separation: 
            <input type="range" id="zSeparation" min="1" max="20" value="5" />
            <span id="zValue">5</span>
        </label>
        <button id="loadData">Load Data</button>
        <span id="loadStatus"></span>
    </div>
    
    <div id="info" class="info" style="display: none;"></div>
    <div id="plot"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"></script>
<script>
    let currentData = null;
    const JSON_FILE_PATH = 'https://tatva.sumityadav.com.np/posts/2025/09/05/embeddinggemma-300m/all_layerwise_embeddings.json';
    
    // Color palette for categories
    const colors = [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
        '#ff7f00', '#ffff33', '#a65628', '#f781bf'
    ];

    document.getElementById('loadData').addEventListener('click', loadDataFromFile);
    document.getElementById('datasetSelect').addEventListener('change', updateVisualization);
    document.getElementById('zSeparation').addEventListener('input', function() {
        document.getElementById('zValue').textContent = this.value;
        updateVisualization();
    });

    // Load data automatically on page load
    window.addEventListener('load', loadDataFromFile);

    function loadDataFromFile() {
        const statusEl = document.getElementById('loadStatus');
        statusEl.textContent = 'Loading...';
        statusEl.style.color = 'orange';
        
        fetch(JSON_FILE_PATH)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentData = data;
                populateDatasetSelect();
                updateVisualization();
                statusEl.textContent = 'Data loaded successfully!';
                statusEl.style.color = 'green';
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                statusEl.textContent = `Error loading data: ${error.message}`;
                statusEl.style.color = 'red';
                
                // Show fallback message
                document.getElementById('plot').innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 18px;">
                        <div style="text-align: center;">
                            <p>Could not load JSON file from: ${JSON_FILE_PATH}</p>
                            <p style="font-size: 14px; color: #999;">
                                Make sure the file exists at the specified path and the browser has permission to access it.
                            </p>
                            <p style="font-size: 12px; color: #ccc;">
                                Note: For security reasons, browsers may block local file access. 
                                Consider running a local web server or hosting the file.
                            </p>
                        </div>
                    </div>
                `;
            });
    }

    function populateDatasetSelect() {
        const select = document.getElementById('datasetSelect');
        select.innerHTML = '<option value="">Select Dataset</option>';
        
        if (currentData) {
            // Check if data has multiple datasets
            const datasetNames = Object.keys(currentData);
            if (datasetNames.length > 1) {
                datasetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    select.appendChild(option);
                });
                select.style.display = 'block';
                select.value = datasetNames[0]; // Select first dataset
            } else {
                select.style.display = 'none';
            }
        }
    }

    function getCurrentDataset() {
        if (!currentData) return null;
        
        const selectedDataset = document.getElementById('datasetSelect').value;
        
        if (selectedDataset && currentData[selectedDataset]) {
            return currentData[selectedDataset];
        } else if (currentData.layers) {
            // Single dataset format
            return currentData;
        } else {
            // Multiple datasets, return first one
            const firstKey = Object.keys(currentData)[0];
            return currentData[firstKey];
        }
    }

    function updateVisualization() {
        const dataset = getCurrentDataset();
        if (!dataset) return;

        const zSeparation = parseInt(document.getElementById('zSeparation').value);
        
        // Update info
        const info = document.getElementById('info');
        info.style.display = 'block';
        info.innerHTML = `
            <strong>Dataset:</strong> ${dataset.dataset_name || 'Unknown'} | 
            <strong>Description:</strong> ${dataset.description || 'N/A'} | 
            <strong>Total Items:</strong> ${dataset.total_items || 'N/A'} | 
            <strong>Layers:</strong> ${dataset.num_layers || Object.keys(dataset.layers).length}
        `;

        // Prepare data for plotting
        const traces = [];
        const categories = dataset.categories || [];
        const categoryColors = {};
        categories.forEach((cat, i) => {
            categoryColors[cat] = colors[i % colors.length];
        });

        // Create traces for each category
        categories.forEach(category => {
            const x = [], y = [], z = [], text = [], layer_info = [];
            
            Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
                const layerIdx = parseInt(layerStr);
                const zLevel = layerIdx * zSeparation;
                
                layerData.items.forEach(item => {
                    if (item.category === category) {
                        x.push(item.pca_coordinates.x);
                        y.push(item.pca_coordinates.y);
                        z.push(zLevel);
                        text.push(`${item.text}<br>Category: ${item.category}<br>Layer: ${layerIdx}`);
                        layer_info.push(layerIdx);
                    }
                });
            });

            if (x.length > 0) {
                traces.push({
                    x: x,
                    y: y,
                    z: z,
                    text: text,
                    type: 'scatter3d',
                    mode: 'markers',
                    name: category,
                    marker: {
                        size: 6,
                        color: categoryColors[category],
                        opacity: 0.8,
                        line: {
                            color: 'black',
                            width: 0.5
                        }
                    },
                    hovertemplate: '%{text}<extra></extra>'
                });
            }
        });

        // Add trajectory lines for same text across layers
        const textTrajectories = {};
        Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
            const layerIdx = parseInt(layerStr);
            const zLevel = layerIdx * zSeparation;
            
            layerData.items.forEach(item => {
                if (!textTrajectories[item.text]) {
                    textTrajectories[item.text] = {
                        x: [], y: [], z: [], 
                        category: item.category
                    };
                }
                textTrajectories[item.text].x.push(item.pca_coordinates.x);
                textTrajectories[item.text].y.push(item.pca_coordinates.y);
                textTrajectories[item.text].z.push(zLevel);
            });
        });

        // Add trajectory lines
        Object.values(textTrajectories).forEach((traj, i) => {
            if (traj.x.length > 1) {
                traces.push({
                    x: traj.x,
                    y: traj.y,
                    z: traj.z,
                    type: 'scatter3d',
                    mode: 'lines',
                    name: '',
                    showlegend: false,
                    line: {
                        color: categoryColors[traj.category],
                        width: 2,
                        opacity: 0.3
                    },
                    hoverinfo: 'skip'
                });
            }
        });

        const layout = {
            title: `3D Layer-wise Embedding Evolution: ${dataset.dataset_name || 'Dataset'}`,
            scene: {
                xaxis: { title: 'PC1' },
                yaxis: { title: 'PC2' },
                zaxis: { title: 'Layer Index' },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            },
            margin: { l: 0, r: 0, b: 0, t: 40 },
            legend: {
                x: 0,
                y: 1
            }
        };

        Plotly.newPlot('plot', traces, layout, {
            responsive: true,
            displayModeBar: true
        });
    }

    // Instructions for user
    if (!currentData) {
        document.getElementById('plot').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 18px;">
                <div style="text-align: center;">
                    <p>Loading data from: ${JSON_FILE_PATH}</p>
                    <p style="font-size: 14px; color: #999;">
                        Click "Load Data" if the data doesn't load automatically
                    </p>
                </div>
            </div>
        `;
    }
</script>
</div>

## How to Use

1. The visualization will attempt to load data automatically
2. Use the dropdown to switch between different datasets
3. Adjust the Z-separation slider to change layer spacing
4. Click and drag to rotate the 3D plot
5. Use mouse wheel to zoom in/out
6. Hover over points to see detailed information

## Technical Details

The visualization uses:
- **Plotly.js** for 3D rendering
- **PCA coordinates** for 2D positioning at each layer
- **Layer index** as the Z-axis dimension
- **Trajectory lines** to show evolution paths
- **Color coding** by semantic categories

## Interpretation

- Points closer together represent similar embeddings
- Trajectory lines show how individual samples move through the embedding space
- Layer progression (Z-axis) reveals how the network transforms representations
- Category clustering indicates semantic organization at different layers

---

*Note: This visualization requires the JSON data file to be accessible at the specified path. For local development, consider running a simple web server to avoid browser security restrictions.*
