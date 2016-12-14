import babelDecoratorProps from 'babel-plugin-transform-decorator-props';
import babelInjectPlugin from 'babel-plugin-transform-inject-template';
import { transform } from 'babel-core';
import { parse } from 'path';

function getQualifiedName(options) {
    let { componentPath, componentName, componentNamespace } = options;
    const pathObj = parse(componentPath);
    const dirParts = pathObj.dir.split('/');
    const customName = dirParts.pop();
    const customNS = dirParts.pop();

    componentNamespace = componentNamespace || customNS.toLowerCase();;
    componentName = componentName || customName.toLowerCase(); 

    return { componentName, componentNamespace };
}

export default function (options = {}) {
    const { componentNamespace, componentName } = getQualifiedName(options);
    const localBabelConfig = {
        babelrc: false,
        sourceMaps: true,
        plugins: [
            [babelDecoratorProps, { componentNamespace, componentName }],
            babelInjectPlugin
        ],
        parserOpts: { plugins: ['*'] }
    };

    options = Object.assign({}, options.babelConfig || {}, localBabelConfig);

    return {
        name : 'transform-class',
        injected: false,
        transform (src, id) {
            //console.log('[]transform-class', '\t>> ' , id);
            if (!this.injected) {
                this.injected = true;
                const localOptions = Object.assign(options, { filename: id });
                const { code, map } = transform(src, localOptions);
                return { code, map };    
            }            
        }
    };
}