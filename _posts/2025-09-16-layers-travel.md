---
title: layers-travel
date: 2025-09-16
categories: [machine-learning, visualization, neural-networks]
tags: [embeddings, pca, 3d-visualization, plotly]
description: "Interactive 3D visualization of how neural network embeddings evolve across layers"
---

---
layout: post
title: "3D Layerwise Embedding Evolution: A Journey Through Transformer Representations"
date: 2025-09-16
categories: [machine-learning, visualization, transformers]
tags: [embeddings, neural-networks, pca, 3d-visualization, transformers]
description: "Interactive 3D visualization showing how transformer embeddings evolve through neural network layers"
---

# 3D Layerwise Embedding Evolution

This interactive 3D visualization reveals how transformer embeddings evolve through the 25 layers of a neural network. Watch as semantic representations transform from scattered, unstructured patterns in early layers to clearly defined clusters in deeper layers.

<script src="https://cdn.jsdelivr.net/npm/plotly.js-dist@2.26.0/plotly.min.js"></script>

<div class="visualization-wrapper">
    <div class="controls-panel">
        <div class="control-group">
            <label for="dataset-select">Dataset:</label>
            <select id="dataset-select">
                <option value="sentiment_analysis">Sentiment Analysis</option>
                <option value="academic_subjects">Academic Subjects</option>
                <option value="scientific_domains">Scientific Domains</option>
            </select>
        </div>
        
        <div class="control-group">
            <label>
                <input type="checkbox" id="show-trajectories" checked>
                Show Trajectories
            </label>
        </div>
        
        <div class="control-group">
            <label>
                <input type="checkbox" id="layer-spacing" checked>
                Enhanced Layer Spacing
            </label>
        </div>
    </div>
    
    <div id="loading-state" class="status-message">
        Loading 3D visualization...
    </div>
    
    <div id="error-state" class="status-message error" style="display: none;">
        Unable to load visualization data. Please check your connection.
    </div>
    
    <div id="plot-3d" style="width:100%; height:600px; display:none;"></div>
    
    <div id="dataset-info" class="info-section" style="display:none;">
        <h3>Dataset Statistics</h3>
        <div class="stats-container">
            <div class="stat-item">
                <span class="stat-label">Total Items:</span>
                <span class="stat-value" id="total-items">-</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Categories:</span>
                <span class="stat-value" id="categories-list">-</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Layers:</span>
                <span class="stat-value">25 (L0-L24)</span>
            </div>
        </div>
    </div>
</div>

## Understanding the Visualization

### 3D Structure
- **X-axis (PC1)**: First principal component of embeddings
- **Y-axis (PC2)**: Second principal component of embeddings  
- **Z-axis**: Layer depth (0-24) through the transformer network

### Visual Elements
- **Colored Points**: Each category has a distinct color (science/math/literature, positive/negative/neutral, etc.)
- **Trajectory Lines**: Faint lines connecting how individual text samples move through embedding space
- **Layer Separation**: Vertical spacing shows the progression through network layers

### Key Observations

#### Early Layers (0-5)
- Embeddings appear relatively mixed and unstructured
- Limited semantic separation between categories
- Lower explained variance in PCA components

#### Middle Layers (6-15)  
- Gradual emergence of category-specific clustering
- Increasing separation between semantic groups
- Peak explained variance often occurs in this range

#### Late Layers (16-24)
- Clear, distinct clusters for each category
- Strong semantic organization
- Stable representational structure

## Dataset Comparisons

### Academic Subjects
Categories: Science, Mathematics, Literature
- Mathematics concepts cluster tightly in later layers
- Science topics show broad but consistent grouping  
- Literature maintains distinct semantic space

### Sentiment Analysis
Categories: Positive, Negative, Neutral
- Clear emotional polarity emerges by layer 10-12
- Neutral sentiments occupy intermediate space
- Strong linear separability in final layers

### Scientific Domains  
Categories: Astronomy, Biology, Physics
- Domain-specific terminologies create clear boundaries
- Physics and astronomy show some overlap (mathematical concepts)
- Biology maintains distinct biological/life science cluster

## Technical Implementation

The visualization processes 1,800 data points (24 items × 25 layers × 3 datasets) in real-time, applying PCA dimensionality reduction while preserving the temporal evolution through network layers.

<style>
.visualization-wrapper {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.controls-panel {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
    backdrop-filter: blur(10px);
}

.control-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-group label {
    font-weight: 600;
    color: #495057;
    font-size: 14px;
}

.control-group select {
    padding: 6px 12px;
    border: 2px solid #dee2e6;
    border-radius: 6px;
    background: white;
    font-size: 14px;
    min-width: 160px;
}

.control-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.control-group input[type="checkbox"] {
    transform: scale(1.2);
    margin-right: 5px;
}

.status-message {
    text-align: center;
    padding: 40px;
    font-size: 1.1rem;
    color: #6c757d;
    background: rgba(255,255,255,0.8);
    border-radius: 8px;
}

.status-message.error {
    color: #dc3545;
    background: rgba(248, 215, 218, 0.8);
}

.info-section {
    margin-top: 20px;
    padding: 20px;
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
    backdrop-filter: blur(10px);
}

.info-section h3 {
    margin-top: 0;
    color: #495057;
    font-size: 1.2rem;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: white;
    border-radius: 6px;
    border-left: 4px solid #667eea;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-label {
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
}

.stat-value {
    font-weight: 700;
    color: #667eea;
    font-size: 1rem;
}

#plot-3d {
    background: rgba(255,255,255,0.95);
    border-radius: 8px;
    backdrop-filter: blur(10px);
}
</style>

<script>
let embeddingsData = null;
let currentDataset = 'academic_subjects';

// Color schemes for each dataset
const colorSchemes = {
    sentiment_analysis: {
        'positive': '#27ae60',
        'negative': '#e74c3c', 
        'neutral': '#3498db'
    },
    academic_subjects: {
        'science': '#e74c3c',
        'mathematics': '#1abc9c',
        'literature': '#3498db'
    },
    scientific_domains: {
        'astronomy': '#9b59b6',
        'biology': '#f39c12',
        'physics': '#e91e63'
    }
};

async function loadVisualizationData() {
    try {
        const response = await fetch('https://tatva.sumityadav.com.np/posts/2025/09/16/layers-travel/all_layerwise_embeddings.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        embeddingsData = await response.json();
        
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('plot-3d').style.display = 'block';
        document.getElementById('dataset-info').style.display = 'block';
        
        setupEventListeners();
        renderVisualization();
        updateDatasetInfo();
        
    } catch (error) {
        console.error('Failed to load visualization data:', error);
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'block';
    }
}

function setupEventListeners() {
    document.getElementById('dataset-select').addEventListener('change', function(e) {
        currentDataset = e.target.value;
        renderVisualization();
        updateDatasetInfo();
    });
    
    document.getElementById('show-trajectories').addEventListener('change', renderVisualization);
    document.getElementById('layer-spacing').addEventListener('change', renderVisualization);
}

function updateDatasetInfo() {
    if (!embeddingsData || !embeddingsData[currentDataset]) return;
    
    const dataset = embeddingsData[currentDataset];
    document.getElementById('total-items').textContent = dataset.total_items;
    document.getElementById('categories-list').textContent = dataset.categories.join(', ');
}

function renderVisualization() {
    if (!embeddingsData || !embeddingsData[currentDataset]) return;
    
    const dataset = embeddingsData[currentDataset];
    const showTrajectories = document.getElementById('show-trajectories').checked;
    const enhancedSpacing = document.getElementById('layer-spacing').checked;
    const colors = colorSchemes[currentDataset];
    
    // Build trajectory data for each text item
    const trajectoryMap = {};
    
    Object.keys(dataset.layers).forEach(layerKey => {
        const layerIndex = parseInt(layerKey);
        const layerData = dataset.layers[layerKey];
        
        layerData.items.forEach((item, itemIndex) => {
            const uniqueKey = `${item.category}_${itemIndex}`;
            
            if (!trajectoryMap[uniqueKey]) {
                trajectoryMap[uniqueKey] = {
                    category: item.category,
                    text: item.text,
                    coordinates: []
                };
            }
            
            trajectoryMap[uniqueKey].coordinates.push({
                x: item.pca_coordinates.x,
                y: item.pca_coordinates.y,
                z: enhancedSpacing ? layerIndex * 120 : layerIndex * 50,
                layer: layerIndex
            });
        });
    });
    
    let plotTraces = [];
    
    // Create scatter traces for each category
    const categoryGroups = {};
    Object.values(trajectoryMap).forEach(trajectory => {
        const category = trajectory.category;
        
        if (!categoryGroups[category]) {
            categoryGroups[category] = {
                x: [], y: [], z: [],
                text: [], customdata: [],
                mode: 'markers',
                type: 'scatter3d',
                name: category.charAt(0).toUpperCase() + category.slice(1),
                marker: {
                    color: colors[category] || '#95a5a6',
                    size: 5,
                    opacity: 0.8,
                    line: { color: 'rgba(0,0,0,0.1)', width: 0.5 }
                },
                hovertemplate: '<b>%{text}</b><br>' +
                             'PC1: %{x:.1f}<br>' +
                             'PC2: %{y:.1f}<br>' +
                             'Layer: %{customdata}<br>' +
                             '<extra></extra>'
            };
        }
        
        trajectory.coordinates.forEach(coord => {
            categoryGroups[category].x.push(coord.x);
            categoryGroups[category].y.push(coord.y);
            categoryGroups[category].z.push(coord.z);
            categoryGroups[category].text.push(trajectory.text);
            categoryGroups[category].customdata.push(coord.layer);
        });
    });
    
    plotTraces = Object.values(categoryGroups);
    
    // Add trajectory lines if enabled
    if (showTrajectories) {
        Object.values(trajectoryMap).forEach((trajectory, index) => {
            const coords = trajectory.coordinates;
            plotTraces.push({
                x: coords.map(c => c.x),
                y: coords.map(c => c.y),
                z: coords.map(c => c.z),
                mode: 'lines',
                type: 'scatter3d',
                line: {
                    color: colors[trajectory.category] || '#95a5a6',
                    width: 2,
                    opacity: 0.4
                },
                showlegend: false,
                hoverinfo: 'none'
            });
        });
    }
    
    const layout = {
        title: {
            text: `3D Layer-wise Embedding Evolution: ${dataset.description}`,
            font: { size: 16, color: '#2c3e50' }
        },
        scene: {
            xaxis: { 
                title: 'PC1',
                gridcolor: 'rgba(128,128,128,0.3)',
                backgroundcolor: 'rgba(240,240,240,0.1)'
            },
            yaxis: { 
                title: 'PC2',
                gridcolor: 'rgba(128,128,128,0.3)',
                backgroundcolor: 'rgba(240,240,240,0.1)'
            },
            zaxis: { 
                title: 'Layer Index',
                gridcolor: 'rgba(128,128,128,0.3)',
                backgroundcolor: 'rgba(240,240,240,0.1)'
            },
            camera: {
                eye: { x: 1.8, y: 1.8, z: 1.2 },
                center: { x: 0, y: 0, z: 0.3 }
            },
            aspectmode: 'manual',
            aspectratio: { x: 1, y: 1, z: 0.8 },
            bgcolor: 'rgba(248,249,250,0.8)'
        },
        showlegend: true,
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255,255,255,0.95)',
            bordercolor: 'rgba(0,0,0,0.1)',
            borderwidth: 1
        },
        margin: { l: 0, r: 0, t: 40, b: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
        displaylogo: false
    };
    
    Plotly.newPlot('plot-3d', plotTraces, layout, config);
}

// Initialize visualization when page loads
document.addEventListener('DOMContentLoaded', loadVisualizationData);
</script>

## Research Implications

This 3D visualization demonstrates several key principles of transformer architectures:

1. **Hierarchical Representation Learning**: Early layers capture surface-level patterns while deeper layers develop semantic understanding
2. **Emergent Clustering**: Categories naturally separate without explicit supervision
3. **Representation Stability**: Final layers show consistent, structured embeddings suitable for downstream tasks

The ability to visualize this transformation provides insights into why transformer models are so effective at natural language understanding tasks - they automatically develop meaningful semantic representations through their layered architecture.
