// Placement data only. Coordinates reference the approved 144x84 world layout.
export const ART = {
 mountain:'mountain',tower:'tower',academy:'academy',hospital:'hospital',ramen:'ramen',
 houses:['house-round','house-tile','house-blue','house-terrace','house-orange','house-courtyard'],
 shops:['market-stall','food-stall','market-stall'], trees:['tree-oak','tree-pine','tree-willow'], cherries:['cherry-wide','cherry-curved'], bridges:['bridge-wood','bridge-stone-flat','bridge-wood-large']
};
export const DECOR=[
 ['cherry-wide',56,33,5.2],['cherry-curved',88,33,5.4],['cherry-wide',57,49,5.2],['cherry-curved',88,49,5.2],
 ['tree-oak',58,8,7],['tree-pine',86,8,6],['tree-willow',42,28,5.5],['tree-oak',108,28,6],['tree-pine',132,30,6],['tree-willow',29,39,5.5],['tree-oak',29,47,5.5],['tree-pine',43,38,5.5],['tree-oak',43,48,5.2],
 ['lamp-post',65,34,1.25],['lamp-post',79,34,1.25],['lamp-post',65,51,1.25],['lamp-post',79,51,1.25],['lamp-post',66,69,1.25],['lamp-post',78,63,1.25],
 ['bench-back',59,39,3],['bench-back',85,47,3],['notice-board',58.5,29,3],['flowers-pink',58,37,3],['flowers-pink',86,45,3],['bush-medium',58,52,3],['bush-medium',88,52,3],['rocks-flat',29,45,3],['barrel-large',91,60,1.3],
 ...Array.from({length:4},(_,i)=>['training-post',112+i*5,18,1.5])
];
export const VIEW={elevation:Math.atan2(25,30),sample:{x:72,z:16,height:105},walkHeight:30};
