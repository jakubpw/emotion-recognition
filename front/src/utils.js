export const selected_face_mesh_points_dict = {
    0: 61,
    1: 292,
    2: 0,
    3: 17,
    4:	50,
    5:	280,
    6:	48,
    7:	4,
    8:	278,
    9:  206,
    10:	426,
    11:	133,
    12:	130,
    13:	159,
    14:	145,
    15:	362,
    16:	359,
    17:	386,
    18:	374,
    19:	122,
    20:	351,
    21:	46,
    22:	105,
    23:	107,
    24:	276,
    25:	334,
    26:	336,
}

export const angles_points = [
    [2, 0, 3],
    [0, 2, 1],
    [6, 7, 8],
    [9, 7, 10],
    [0, 7, 1],
    [1, 5, 8],
    [0, 4, 6],
    [1, 10, 8],
    [0, 9, 6],
    [13, 12, 14],
    [12, 13, 11],
    [17, 15, 18],
    [15, 17, 16],
    [21, 22, 23],
    [26, 25, 24],
    [6, 19, 23],
    [8, 20, 26],
]
export const target_names = ['Happiness', 'Sadness', 'Fear', 'Anger', 'Surprise', 'Neutral'];
export function normalization(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}
export function dot_product_angle(v1, v2) {
    let res = Math.acos((v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (normalization(v1) * normalization(v2)))
    return  res * 180 / Math.PI;
}
export function get_angle(x1, x2, x3) {
    const v1 = [x1.x - x2.x, x1.y - x2.y, x1.z - x2.z]
    const v2 = [x3.x - x2.x, x3.y - x2.y, x3.z - x2.z]
    return dot_product_angle(v1, v2)
}