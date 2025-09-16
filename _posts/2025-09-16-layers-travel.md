---
title: layers-travel
date: 2025-09-16
categories: [machine-learning, visualization, neural-networks]
tags: [embeddings, pca, 3d-visualization, plotly]
description: "Interactive 3D visualization of how neural network embeddings evolve across layers"
---

# Visualizing Transformer Layer Embeddings: A Journey Through Neural Network Representations

This visualization explores how transformer embeddings evolve across different layers of a neural network. We examine three datasets - sentiment analysis, academic subjects, and scientific domains - to understand how semantic representations develop through the layers.

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/plotly.js-dist@2.26.0/plotly.min.js"></script>

## Interactive Layer-wise PCA Visualizations

<div class="visualization-container">
  <div class="controls">
    <label for="dataset-select">Dataset:</label>
    <select id="dataset-select">
      <option value="sentiment_analysis">Sentiment Analysis</option>
      <option value="academic_subjects">Academic Subjects</option>
      <option value="scientific_domains">Scientific Domains</option>
    </select>
    
    <label for="layer-slider">Layer:</label>
    <input type="range" id="layer-slider" min="0" max="24" value="0">
    <span id="layer-value">0</span>
    
    <button id="animate-btn">Animate Through Layers</button>
  </div>
  
  <div id="scatter-plot" style="width:100%;height:500px;"></div>
  
  <div class="layer-info">
    <h3>Layer <span id="current-layer">0</span> Statistics</h3>
    <div class="stats-grid">
      <div class="stat">
        <strong>Explained Variance (PC1):</strong>
        <span id="variance-pc1">-</span>%
      </div>
      <div class="stat">
        <strong>Explained Variance (PC2):</strong>
        <span id="variance-pc2">-</span>%
      </div>
      <div class="stat">
        <strong>Total Variance Captured:</strong>
        <span id="total-variance">-</span>%
      </div>
    </div>
  </div>
</div>

## Variance Analysis Across Layers

<div id="variance-plot" style="width:100%;height:400px;"></div>

## Key Insights

### Evolution of Semantic Clustering

The visualizations reveal how semantic representations evolve through transformer layers:

1. **Early Layers (0-4)**: Embeddings show relatively low explained variance and mixed clustering
2. **Middle Layers (5-15)**: Gradual emergence of clearer category separation
3. **Later Layers (16-24)**: More distinct clustering with higher explained variance

### Dataset-Specific Patterns

#### Sentiment Analysis
- **Categories**: Positive, Negative, Neutral
- **Peak separation**: Around layers 10-15
- **Final layer clustering**: Strong sentiment-based groupings

#### Academic Subjects  
- **Categories**: Science, Mathematics, Literature
- **Peak separation**: Around layers 12-18
- **Final layer clustering**: Clear disciplinary boundaries

#### Scientific Domains
- **Categories**: Astronomy, Biology, Physics
- **Peak separation**: Around layers 8-14
- **Final layer clustering**: Well-defined domain clusters

### Explained Variance Trends

The explained variance by the first two principal components shows interesting patterns:

- **Layer 0**: Low variance (15-20%), indicating distributed representations
- **Peak layers**: Middle layers often show highest total variance capture
- **Final layers**: Variable patterns depending on task complexity

<style>
.visualization-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.controls label {
  font-weight: bold;
}

.controls select, .controls input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls button {
  padding: 8px 16px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background-color: #005a99;
}

.layer-info {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.stat {
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>

<script>
// Load the embeddings data
let embeddingsData;

// Fetch the data
fetch('https://tatva.sumityadav.com.np/posts/2025/09/16/layers-travel/all_layerwise_embeddings.json')
  .then(response => response.json())
  .then(data => {
    embeddingsData = data;
    initializeVisualization();
  })
  .catch(error => {
    console.error('Error loading data:', error);
    document.getElementById('scatter-plot').innerHTML = '<p>Error loading visualization data. Please check the data source.</p>';
  });

let currentDataset = 'sentiment_analysis';
let currentLayer = 0;
let isAnimating = false;

function initializeVisualization() {
  // Set up event listeners
  document.getElementById('dataset-select').addEventListener('change', function(e) {
    currentDataset = e.target.value;
    updateVisualization();
    updateVarianceChart();
  });
  
  document.getElementById('layer-slider').addEventListener('input', function(e) {
    currentLayer = parseInt(e.target.value);
    document.getElementById('layer-value').textContent = currentLayer;
    updateVisualization();
  });
  
  document.getElementById('animate-btn').addEventListener('click', function() {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });
  
  // Initial visualization
  updateVisualization();
  updateVarianceChart();
}

function updateVisualization() {
  if (!embeddingsData) return;
  
  const dataset = embeddingsData[currentDataset];
  const layerData = dataset.layers[currentLayer.toString()];
  
  if (!layerData) return;
  
  // Prepare data for Plotly
  const traces = {};
  const colors = {
    'positive': '#2E8B57',
    'negative': '#DC143C', 
    'neutral': '#4682B4',
    'science': '#FF6B6B',
    'mathematics': '#4ECDC4',
    'literature': '#45B7D1',
    'astronomy': '#96CEB4',
    'biology': '#FECA57',
    'physics': '#FF9FF3'
  };
  
  // Group items by category
  layerData.items.forEach(item => {
    if (!traces[item.category]) {
      traces[item.category] = {
        x: [],
        y: [],
        text: [],
        mode: 'markers',
        type: 'scatter',
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        marker: {
          color: colors[item.category] || '#666666',
          size: 8,
          opacity: 0.7
        }
      };
    }
    
    traces[item.category].x.push(item.pca_coordinates.x);
    traces[item.category].y.push(item.pca_coordinates.y);
    traces[item.category].text.push(item.text);
  });
  
  const plotData = Object.values(traces);
  
  const layout = {
    title: `${dataset.description} - Layer ${currentLayer}`,
    xaxis: {
      title: `PC1 (${(layerData.explained_variance[0] * 100).toFixed(1)}%)`,
      zeroline: true
    },
    yaxis: {
      title: `PC2 (${(layerData.explained_variance[1] * 100).toFixed(1)}%)`,
      zeroline: true
    },
    showlegend: true,
    hovermode: 'closest',
    margin: { t: 50, l: 80, r: 20, b: 80 }
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };
  
  Plotly.newPlot('scatter-plot', plotData, layout, config);
  
  // Update stats
  document.getElementById('current-layer').textContent = currentLayer;
  document.getElementById('variance-pc1').textContent = (layerData.explained_variance[0] * 100).toFixed(2);
  document.getElementById('variance-pc2').textContent = (layerData.explained_variance[1] * 100).toFixed(2);
  document.getElementById('total-variance').textContent = (layerData.total_variance_captured * 100).toFixed(2);
}

function updateVarianceChart() {
  if (!embeddingsData) return;
  
  const dataset = embeddingsData[currentDataset];
  const layers = Array.from({length: 25}, (_, i) => i);
  
  const pc1Variance = layers.map(layer => dataset.layers[layer.toString()].explained_variance[0] * 100);
  const pc2Variance = layers.map(layer => dataset.layers[layer.toString()].explained_variance[1] * 100);
  const totalVariance = layers.map(layer => dataset.layers[layer.toString()].total_variance_captured * 100);
  
  const traces = [
    {
      x: layers,
      y: pc1Variance,
      name: 'PC1 Explained Variance',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#1f77b4' }
    },
    {
      x: layers,
      y: pc2Variance,
      name: 'PC2 Explained Variance', 
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ff7f0e' }
    },
    {
      x: layers,
      y: totalVariance,
      name: 'Total Variance Captured',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#2ca02c', width: 3 }
    }
  ];
  
  const layout = {
    title: `Explained Variance Across Layers - ${dataset.description}`,
    xaxis: {
      title: 'Layer',
      range: [0, 24]
    },
    yaxis: {
      title: 'Explained Variance (%)',
      range: [0, Math.max(...totalVariance) * 1.1]
    },
    showlegend: true,
    margin: { t: 50, l: 80, r: 20, b: 80 }
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('variance-plot', traces, layout, config);
}

function startAnimation() {
  if (isAnimating) return;
  
  isAnimating = true;
  document.getElementById('animate-btn').textContent = 'Stop Animation';
  
  const animateStep = () => {
    if (!isAnimating) return;
    
    currentLayer = (currentLayer + 1) % 25;
    document.getElementById('layer-slider').value = currentLayer;
    document.getElementById('layer-value').textContent = currentLayer;
    updateVisualization();
    
    setTimeout(animateStep, 500); // 500ms delay between frames
  };
  
  animateStep();
}

function stopAnimation() {
  isAnimating = false;
  document.getElementById('animate-btn').textContent = 'Animate Through Layers';
}
</script>

## Technical Details

### Data Processing
- **PCA**: 2-component principal component analysis applied to each layer's embeddings
- **Normalization**: Embeddings normalized before PCA transformation
- **Layers**: 25 transformer layers (0-24) analyzed for each dataset

### Datasets
1. **Sentiment Analysis**: 24 text samples across positive/negative/neutral sentiments
2. **Academic Subjects**: 24 text samples across science/mathematics/literature domains  
3. **Scientific Domains**: 24 text samples across astronomy/biology/physics fields

### Visualization Features
- **Interactive scatter plots**: Click and drag to explore, hover for text details
- **Layer animation**: Observe how clustering evolves through the network
- **Variance tracking**: Monitor explained variance across layers
- **Multi-dataset comparison**: Switch between different semantic tasks

This analysis provides insights into how transformer models develop increasingly specialized and structured representations of semantic content as information flows through deeper layers of the network.
