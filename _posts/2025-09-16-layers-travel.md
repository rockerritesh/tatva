---
title: layers-travel
date: 2025-09-16
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
.demo-note {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
    color: #856404;
}
</style>

<div class="viz-container">
    <div class="demo-note">
        <strong>Demo Mode:</strong> Since the external JSON file is not accessible, this visualization uses synthetic data to demonstrate how neural network embeddings evolve across layers.
    </div>
    
    <div class="controls">
        <select id="datasetSelect">
            <option value="sentiment">Sentiment Analysis</option>
            <option value="academic">Academic Subjects</option>
            <option value="scientific">Scientific Domains</option>
        </select>
        <label>
            Z-separation: 
            <input type="range" id="zSeparation" min="1" max="20" value="5" />
            <span id="zValue">5</span>
        </label>
        <button id="generateData">Generate New Data</button>
        <span id="loadStatus">Ready</span>
    </div>
    
    <div id="info" class="info"></div>
    <div id="plot"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"></script>
<script>
    let currentData = null;
    
    // Color palette for categories
    const colors = [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
        '#ff7f00', '#ffff33', '#a65628', '#f781bf'
    ];

    // Dataset definitions
    const datasetConfigs = {
        sentiment: {
            dataset_name: 'Sentiment Analysis',
            description: 'Text samples with positive, negative, and neutral sentiments',
            categories: ['Positive', 'Negative', 'Neutral'],
            samples: [
                'This movie is absolutely fantastic!',
                'I love sunny days and fresh air',
                'What a wonderful surprise this was',
                'This is the worst experience ever',
                'I hate waiting in long lines',
                'Terrible service and bad food',
                'The weather is okay today',
                'This product works as expected',
                'Nothing special about this place'
            ]
        },
        academic: {
            dataset_name: 'Academic Subjects',
            description: 'Academic texts from science, mathematics, and literature',
            categories: ['Science', 'Mathematics', 'Literature'],
            samples: [
                'Photosynthesis converts light energy into chemical energy',
                'DNA replication occurs during the S phase',
                'Newton\'s laws describe the motion of objects',
                'The derivative of x squared is 2x',
                'Integration is the reverse of differentiation',
                'Prime numbers have no divisors except 1 and themselves',
                'Shakespeare wrote many famous tragedies',
                'Poetry uses rhythm and metaphor effectively',
                'The hero\'s journey is a common narrative structure'
            ]
        },
        scientific: {
            dataset_name: 'Scientific Domains',
            description: 'Research topics from astronomy, biology, and physics',
            categories: ['Astronomy', 'Biology', 'Physics'],
            samples: [
                'Black holes have intense gravitational fields',
                'Stars form from collapsing gas clouds',
                'Galaxies contain billions of stars',
                'Cells are the basic unit of life',
                'Evolution drives species adaptation',
                'DNA carries genetic information',
                'Quantum mechanics describes subatomic behavior',
                'Energy and matter are equivalent',
                'Forces cause changes in motion'
            ]
        }
    };

    const JSON_FILE_PATH = 'https://tatva.sumityadav.com.np/posts/2025/09/16/layers-travel/all_layerwise_embeddings.json';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add event listeners
        document.getElementById('generateData').addEventListener('click', generateSyntheticData);
        document.getElementById('datasetSelect').addEventListener('change', updateVisualization);
        document.getElementById('zSeparation').addEventListener('input', function() {
            const zValue = document.getElementById('zValue');
            if (zValue) {
                zValue.textContent = this.value;
                updateVisualization();
            }
        });

        // Try to load JSON data first, fallback to synthetic data
        loadDataFromFile();
    });

    function loadDataFromFile() {
        const statusEl = document.getElementById('loadStatus');
        if (statusEl) {
            statusEl.textContent = 'Loading JSON data...';
            statusEl.style.color = 'orange';
        }
        
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
                if (statusEl) {
                    statusEl.textContent = 'JSON data loaded successfully!';
                    statusEl.style.color = 'green';
                }
                
                // Update the demo note to indicate real data is loaded
                const demoNote = document.querySelector('.demo-note');
                if (demoNote) {
                    demoNote.innerHTML = '<strong>Real Data Loaded:</strong> Successfully loaded embedding data from JSON file.';
                    demoNote.style.background = '#d4edda';
                    demoNote.style.borderColor = '#c3e6cb';
                    demoNote.style.color = '#155724';
                }
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                if (statusEl) {
                    statusEl.textContent = `JSON load failed, using synthetic data`;
                    statusEl.style.color = 'orange';
                }
                
                // Update demo note to explain fallback
                const demoNote = document.querySelector('.demo-note');
                if (demoNote) {
                    demoNote.innerHTML = `
                        <strong>Fallback Mode:</strong> Could not load JSON from: ${JSON_FILE_PATH}<br>
                        Error: ${error.message}<br>
                        Using synthetic data to demonstrate the visualization.
                    `;
                }
                
                // Fallback to synthetic data
                generateSyntheticData();
            });
    }

    function populateDatasetSelect() {
        const select = document.getElementById('datasetSelect');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '<option value="">Select Dataset</option>';
        
        if (currentData) {
            // Check if data has multiple datasets
            const datasetNames = Object.keys(currentData);
            if (datasetNames.length > 1 && !currentData.layers) {
                // Multiple datasets format
                datasetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    select.appendChild(option);
                });
                select.value = datasetNames[0]; // Select first dataset
            } else {
                // Single dataset format - hide the select
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

    function generateSyntheticData() {
        const statusEl = document.getElementById('loadStatus');
        if (statusEl) {
            statusEl.textContent = 'Generating...';
            statusEl.style.color = 'orange';
        }

        const selectedDataset = document.getElementById('datasetSelect').value;
        const config = datasetConfigs[selectedDataset];
        
        // Generate synthetic embedding data
        const numLayers = 6;
        const layers = {};
        
        for (let layer = 0; layer < numLayers; layer++) {
            const items = [];
            
            config.samples.forEach((text, textIdx) => {
                const categoryIdx = textIdx % config.categories.length;
                const category = config.categories[categoryIdx];
                
                // Create realistic embedding evolution
                // Start with random positions, then gradually cluster by category
                const clusterProgress = layer / (numLayers - 1);
                const randomComponent = 1 - clusterProgress;
                const clusterComponent = clusterProgress;
                
                // Base cluster centers for each category
                const clusterCenters = {
                    [config.categories[0]]: { x: -2, y: 1 },
                    [config.categories[1]]: { x: 2, y: -1 },
                    [config.categories[2]]: { x: 0, y: 2 }
                };
                
                const center = clusterCenters[category] || { x: 0, y: 0 };
                
                // Add some consistent individual variation
                const individualSeed = textIdx * 1234.5;
                const individualX = Math.sin(individualSeed) * 0.5;
                const individualY = Math.cos(individualSeed) * 0.5;
                
                const x = (Math.random() - 0.5) * 4 * randomComponent + 
                         center.x * clusterComponent + individualX;
                const y = (Math.random() - 0.5) * 4 * randomComponent + 
                         center.y * clusterComponent + individualY;
                
                items.push({
                    text: text,
                    category: category,
                    pca_coordinates: { x: x, y: y }
                });
            });
            
            layers[layer] = { items: items };
        }
        
        currentData = {
            dataset_name: config.dataset_name,
            description: config.description,
            total_items: config.samples.length,
            num_layers: numLayers,
            categories: config.categories,
            layers: layers
        };
        
        updateVisualization();
        
        if (statusEl) {
            statusEl.textContent = 'Data generated successfully!';
            statusEl.style.color = 'green';
        }
    }

    function updateVisualization() {
        const dataset = getCurrentDataset();
        if (!dataset) return;

        const zSeparation = parseInt(document.getElementById('zSeparation').value) || 5;
        
        // Update info - check if element exists first
        const infoEl = document.getElementById('info');
        if (infoEl) {
            infoEl.style.display = 'block';
            infoEl.innerHTML = `
                <strong>Dataset:</strong> ${dataset.dataset_name || 'Unknown'} | 
                <strong>Description:</strong> ${dataset.description || 'N/A'} | 
                <strong>Total Items:</strong> ${dataset.total_items || 'N/A'} | 
                <strong>Layers:</strong> ${dataset.num_layers || Object.keys(dataset.layers).length}
            `;
        }

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
                        size: 8,
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
                        width: 3,
                        opacity: 0.4
                    },
                    hoverinfo: 'skip'
                });
            }
        });

        const layout = {
            title: {
                text: `3D Layer-wise Embedding Evolution: ${dataset.dataset_name || 'Dataset'}`,
                font: { size: 16 }
            },
            scene: {
                xaxis: { title: 'PC1' },
                yaxis: { title: 'PC2' },
                zaxis: { title: 'Layer Index' },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            },
            margin: { l: 0, r: 0, b: 0, t: 60 },
            legend: {
                x: 0,
                y: 1
            }
        };

        const plotEl = document.getElementById('plot');
        if (plotEl) {
            Plotly.newPlot('plot', traces, layout, {
                responsive: true,
                displayModeBar: true
            });
        }
    }
</script>
</div>

## How to Use

1. Select a dataset from the dropdown menu
2. Click "Generate New Data" to create new synthetic embeddings
3. Adjust the Z-separation slider to change layer spacing
4. Click and drag to rotate the 3D plot
5. Use mouse wheel to zoom in/out
6. Hover over points to see detailed information

## Technical Details

The visualization uses:
- **Plotly.js** for 3D rendering
- **Synthetic PCA coordinates** for 2D positioning at each layer
- **Layer index** as the Z-axis dimension
- **Trajectory lines** to show evolution paths
- **Color coding** by semantic categories

## Interpretation

- Points closer together represent similar embeddings
- Trajectory lines show how individual samples move through the embedding space
- Layer progression (Z-axis) reveals how the network transforms representations
- Category clustering indicates semantic organization at different layers
- Early layers show more random distribution, later layers show clearer category separation

## Key Observations

- **Layer 0-1**: Embeddings start relatively scattered with little semantic structure
- **Layer 2-3**: Gradual emergence of category-based clustering
- **Layer 4-5**: Clear separation between different semantic categories
- **Trajectory lines**: Show smooth transitions rather than abrupt jumps

---

*Note: This demo uses synthetic data to illustrate the concept. In a real implementation, you would replace the synthetic data generation with actual neural network embeddings from your model.*
