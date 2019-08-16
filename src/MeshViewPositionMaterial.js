var THREE = require("three-full");
const THREERGBAPacking = require("three-js-rgba-packing");

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 * @param {boolean} useFloatTexture If true, we consider floatTexture extension is activated and available.
 *                                  The resulting coordinates will be stored in RGB components.
 *                                  If false (default), the coordinate to store must be defined by parameters.coordinate
 *                                  and will be packed in RGBA.
 * @param {string} coordinate x, y or z to choose which coordinate will be packed in RGBA. Values will be mapped from -1:1 to 0:0.5 since
 *                            RGBAPacking package does only provide methods to store in [0,1[ To recover the view coordinate, you need to do
 *                            x = 4*RGBAPacking.decodeUnitFloat32(rgba) - 1;
 */
function MeshViewPositionMaterial( parameters ) {
    parameters = parameters || {};

    parameters.uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.displacementmap
    ]);
    parameters.vertexShader = [

        "#include <common>",
        "#include <displacementmap_pars_vertex>",
        "#include <fog_pars_vertex>",
        "#include <morphtarget_pars_vertex>",
        "#include <skinning_pars_vertex>",
        "#include <shadowmap_pars_vertex>",
        "#include <logdepthbuf_pars_vertex>",
        "#include <clipping_planes_pars_vertex>",

        "varying vec3 vViewPosition;",

        "void main() {",

            "#include <skinbase_vertex>",

            "#include <begin_vertex>",
            "#include <morphtarget_vertex>",
            "#include <skinning_vertex>",
            "#include <displacementmap_vertex>",
            "#include <project_vertex>",
            "#include <logdepthbuf_vertex>",
            "#include <clipping_planes_vertex>",

            "vViewPosition = gl_Position",

        "}"
    ].join("\n");

    parameters.fragmentShader = [
        "varying vec3 vWorldPosition;",
        parameters.useFloatTexture ?
            "" : THREERGBAPacking.glslEncodeUnitFloat32 ,
        "void main() {",
            parameters.useFloatTexture ?
                "gl_FragColor = vViewPosition;" : "gl_FragColor = encodeUnitFloat32(vWorldPosition." + parameters.coordinate + ");",
        "}",
    ].join("\n");

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false;
	this.lights = false;

	this.skinning = false;
	this.morphTargets = false;

	THREE.ShaderMaterial.call( this, parameters);

};

MeshViewPositionMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
MeshViewPositionMaterial.prototype.constructor = MeshViewPositionMaterial;

THREE.MeshViewPositionMaterial = MeshViewPositionMaterial;

module.exports = MeshViewPositionMaterial;
