// 7A.2: render-only orthographic camera profiles. World units, actor sizes and collision remain unchanged.
export const FIELD_CAMERA=Object.freeze({
 classic:Object.freeze({elevation:Math.atan2(100,120),distance:120,lead:3}),
 depth:Object.freeze({elevation:33*Math.PI/180,distance:120,lead:3.8})
});
export function cameraProfile(region,classic=false){return region==='konoha'&&!classic?FIELD_CAMERA.depth:FIELD_CAMERA.classic;}
export function fieldCameraTarget({region,mode,aspect,player,mountainHeight=41,regionWidth,regionHeight,classic=false}){
 const a=Math.max(.1,Number(aspect)||1),profile=cameraProfile(region,classic);
 const close={x:player.x,z:player.y-profile.lead,height:Math.max(24,18/a)};
 if(mode!=='lookout'&&mode!=='travel')return close;
 if(region==='konoha')return {x:72,z:6-mountainHeight/(2*Math.sin(profile.elevation)),height:Math.max(mountainHeight*1.25,136/a)};
 return {x:regionWidth/2,z:regionHeight/2,height:Math.max(regionHeight,regionWidth/a)};
}
export function applyFieldCamera(camera,up,view,aspect,profile){
 const height=Math.max(.1,view.height),a=Math.max(.1,Number(aspect)||1),distance=profile.distance;
 camera.left=-height*a/2;camera.right=-camera.left;camera.top=height/2;camera.bottom=-camera.top;
 camera.position.set(view.x,distance*Math.tan(profile.elevation),view.z+distance);
 camera.lookAt(view.x,0,view.z);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 up.set(0,1,0).applyQuaternion(camera.quaternion);
}
// Ground-plane projection, used by numerical tests. Matches orthographic axes with zero yaw.
export function projectedGround(dx,dz,height,aspect,profile){return {x:2*dx/(height*aspect),y:-2*dz*Math.sin(profile.elevation)/height};}
