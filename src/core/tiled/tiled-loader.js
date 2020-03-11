import { utils, LoaderResource } from 'pixi.js';

export class TiledLoader {
    static use(resource, next) {
        // because this is middleware, it execute in loader context. `this` = loader
        const loader = this;
        //console.log('TiledLoader -> use -> loader', loader);

        if (!resource.data || resource.type !== LoaderResource.TYPE.JSON || !resource.data.tilesets) {
            next();
            return;
        }

        const loadOptions = {
            crossOrigin: resource.crossOrigin,
            metadata: resource.metadata.imageMetadata,
            parentResource: resource,
        };

        let tsResources = [];

        resource.data.tilesets.forEach(element => {
            /** { 
         "image":"tileset.png",  
         "name":"tileset",  
        },  */
            if (!loader.resources[element.name]) {
                tsResources.push({ name: element.name, url: TiledLoader.getResourcePath(resource, loader.baseUrl, element.image) });
            }
        });
        //console.log('TiledLoader -> use -> tsResources', tsResources);
        // load the image for this sheet
        loader.add(tsResources, loadOptions, function onImageLoad(res) {
            if (res.error) {
                next(res.error);
                return;
            }
            next();
        });
    }

    /**
     * Get the texture root path
     * @param {PIXI.LoaderResource} resource - Resource to check path
     * @param {string} baseUrl - Base root url
     */
    static getResourcePath(resource, baseUrl, imageUrl) {
        // Prepend url path unless the resource image is a data url
        if (resource.isDataUrl) {
            return imageUrl;
        }

        return utils.url.resolve(resource.url.replace(baseUrl, ''), imageUrl);
    }
}
