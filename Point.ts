class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setX(x: number) {
        this.x = x;
    }

    setY(y: number) {
        this.y = y;
    }

    /**
     * Returns true or false whether this point is at the given coordinates.
     * @param x The x coordinate
     * @param y The y coordinate
     */
    isAt(x: number, y: number): boolean {
        return this.x === x && this.y === y;
    }

    /**
     * Returns true or false whether this point has equal coordinates to the given point.
     * @param point The point to compare against
     */
    isEqualTo(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    /**
     * Returns a point with the same coordinates as this point.
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

export default Point;