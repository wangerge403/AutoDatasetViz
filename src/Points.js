//import ROSLIB from 'roslib';
import * as THREE from 'three'
import SceneNode from './SceneNode.js'

export default class Points extends THREE.Object3D {

    /**
     * A set of points. Used by PointCloud2 and LaserScan.
     *
     * @constructor
     * @param options - object with following keys:
     *
     *  * tfClient - the TF client handle to use
     *  * rootObject (optional) - the root object to add this marker to use for the points.
     *  * max_pts (optional) - number of points to draw (default: 10000)
     *  * pointRatio (optional) - point subsampling ratio (default: 1, no subsampling)
     *  * messageRatio (optional) - message subsampling ratio (default: 1, no subsampling)
     *  * material (optional) - a material object or an option to construct a PointsMaterial.
     *  * colorsrc (optional) - the field to be used for coloring (default: 'rgb')
     *  * colormap (optional) - function that turns the colorsrc field value to a color
     */
    constructor(options) {
        super();
        options = options || {};
        this.tfClient = options.tfClient;
        this.rootObject = options.rootObject || new THREE.Object3D();
        this.max_pts = options.max_pts || 10000;
        this.pointRatio = options.pointRatio || 1;
        this.messageRatio = options.messageRatio || 1;
        this.messageCount = 0;
        this.material = options.material || {};
        this.colorsrc = options.colorsrc;
        this.colormap = options.colormap;

        if (('color' in options) || ('size' in options) || ('texture' in options)) {
            console.warn(
                'toplevel "color", "size" and "texture" options are deprecated.' +
                'They should beprovided within a "material" option, e.g. : ' +
                ' { tfClient, material : { color: mycolor, size: mysize, map: mytexture }, ... }'
            );
        }

        this.sn = null;
    };


    setup(frame, point_step, fields) {
        if (this.sn === null) {
            // turn fields to a map
            fields = fields || [];
            this.fields = {};
            for (var i = 0; i < fields.length; i++) {
                this.fields[fields[i].name] = fields[i];
            }
            // 将点云数据转换为缓冲区几何体（BufferGeometry）
            this.geom = new THREE.BufferGeometry();
            
            this.positions = new THREE.BufferAttribute(new Float32Array(this.max_pts * 3), 3, false);
            this.geom.setAttribute('position', this.positions.setUsage(THREE.DynamicDrawUsage));

            if (!this.colorsrc && this.fields.rgb) {
                this.colorsrc = 'rgb';
            }
            if (this.colorsrc) {
                var field = this.fields[this.colorsrc];
                if (field) {
                    this.colors = new THREE.BufferAttribute(new Float32Array(this.max_pts * 3), 3, false);
                    this.geom.setAttribute('color', this.colors.setUsage(THREE.DynamicDrawUsage));
                    var offset = field.offset;
                    this.getColor = [
                        function (dv, base, le) { return dv.getInt8(base + offset, le); },
                        function (dv, base, le) { return dv.getUint8(base + offset, le); },
                        function (dv, base, le) { return dv.getInt16(base + offset, le); },
                        function (dv, base, le) { return dv.getUint16(base + offset, le); },
                        function (dv, base, le) { return dv.getInt32(base + offset, le); },
                        function (dv, base, le) { return dv.getUint32(base + offset, le); },
                        function (dv, base, le) { return dv.getFloat32(base + offset, le); },
                        function (dv, base, le) { return dv.getFloat64(base + offset, le); }
                    ][field.datatype - 1];
                    this.colormap = this.colormap || function (x) { return new THREE.Color(x); };
                } else {
                    console.warn('unavailable field "' + this.colorsrc + '" for coloring.');
                }
            }

            if (!this.material.isMaterial) { // if it is an option, apply defaults and pass it to a PointsMaterial
                if (this.colors && this.material.vertexColors === undefined) {
                    this.material.vertexColors = THREE.VertexColors;
                }
                this.material = new THREE.PointsMaterial(this.material);
            }

            this.object = new THREE.Points(this.geom, this.material);

            this.sn = new SceneNode({
                frameID: frame,
                tfClient: this.tfClient,
                object: this.object
            });

            this.rootObject.add(this.sn);
        }
        return (this.messageCount++ % this.messageRatio) === 0;
    };

    update(n) {
        this.geom.setDrawRange(0, n);

        this.positions.needsUpdate = true;
        this.positions.updateRange.count = n * this.positions.itemSize;

        if (this.colors) {
            this.colors.needsUpdate = true;
            this.colors.updateRange.count = n * this.colors.itemSize;
        }
    };
}