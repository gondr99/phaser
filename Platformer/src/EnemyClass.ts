import Birdman from "./Entities/Birdman";
import Enemy from "./Entities/Enemy";

interface EnemyMap {
    [key:string]: any
}

export const EnemyCategory : EnemyMap =
{
    "Birdman": Birdman
}