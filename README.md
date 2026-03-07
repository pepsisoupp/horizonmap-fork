# HorizonMap

HorizonMap is a tool for visualizing the line-of-sight range from any selected point on the globe. It is especially useful for shortwave radio communication or just finding some nice spots:)

![Screenshot](https://maseuko.pl/res/horizonmap.jpg)

## Online version

An online version of the tool is available [here](https://maseuko.pl/soft/horizonmap/).

## Options

- **Radius** – the radius of the circle for which calculations will be performed. Setting a large radius may significantly increase processing time
- **Heightmap Quality** – the quality of the elevation maps used as the basis for calculations
- **Rays** – the number of rays used for calculations
- **Height Offset** – the base height of the "eyes" above the ground
- **Include Earth's Curvature** – includes a simplified simulation of Earth's curvature in the calculations

## Building from source

1. Make sure you have `Node.js` and `npm` installed on your system.

2. Clone the repo:
    
        git clone https://github.com/izawartka/horizonmap/

3. Navigate to the project directory and install dependencies:

        cd horizonmap
        npm install

4. Run the development server:

        npm start

    Or build the project:
    
        npm run build

## Data Sources
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Mapzen](https://www.mapzen.com/blog/terrain-tile-service/)

## Author

masuo / izawartka


## Mapbox elevation

This build prefers Mapbox Terrain-RGB for elevation when you provide a token. Create a `.env` file in the project root with:

```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Then restart the dev server. Without a token, the app falls back to the original Terrarium tiles.


## Terrarium spike fix

This build forces Terrarium sampling to stay on exact source pixels: no Mapbox source, no smoothed resize, and tile bounds are snapped to integer pixel edges before combining. This follows the root cause described in the Reddit thread about Mapzen/Terrarium spikes: resampling elevation PNGs with a smoothing filter can create artificial spikes at steep edges.
