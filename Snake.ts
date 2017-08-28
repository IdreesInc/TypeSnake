import Point from "./Point";

class Snake {
    head: Point;
    tail: Point[] = new Array<Point>();
    direction: string = "right";
    oldDirection: string = "none";
    queuedDirection: string = "none";
    directionsGiven: number = 0;
    public deathCallback: () => void;

    /**
     * Constructs the snake with a head at the given coordinates, and three tail parts.
     * @param x The x coordinate
     * @param y The y coordinate
     */
    constructor(x: number, y: number) {
        this.head = new Point(x, y);
        this.addTailPart();
        this.addTailPart();
        this.addTailPart();
    }

    /**
     * Moves the snake in the direction stored, and evaluates for death scenarios.
     */
    move() {
        if ((this.oldDirection === "left" && this.direction === "right")
            || (this.oldDirection === "right" && this.direction === "left")) {
            this.direction = this.oldDirection;
        } else if ((this.oldDirection === "up" && this.direction === "down")
            || (this.oldDirection === "down" && this.direction === "up")) {
            this.direction = this.oldDirection;
        }
        let oldHead: Point = this.head.clone();
        let oldTail: Point[] = new Array<Point>();
        this.movePoint(this.head);
        for (let i: number = 0; i < this.tail.length; i++) {
            oldTail[i] = this.tail[i].clone();
            if (i === 0) {
                this.tail[i] = oldHead;
                if (this.tail[i].isEqualTo(this.head)) {
                    this.tail[i] = oldTail[i];
                }
            } else {
                this.tail[i] = oldTail[i - 1];
                if (this.tail[i].isEqualTo(this.tail[i - 1])) {
                    this.tail[i] = oldTail[i];
                }
            }
            if (this.head.isEqualTo(this.tail[i])) {
                this.deathCallback();
            }
        }
        if (this.queuedDirection !== "none") {
            this.direction = this.queuedDirection;
            this.queuedDirection = "none";
        }
        this.directionsGiven = 0;
        this.oldDirection = this.direction;
    }

    /**
     * Adds tail cell to the snake.
     */
    addTailPart() {
        if (this.tail.length > 0) {
            this.tail.push(new Point(this.tail[this.tail.length - 1].x, this.tail[this.tail.length - 1].y));
        } else {
            this.tail.push(new Point(this.head.x, this.head.y));
        }
    }

    /**
     * Checks whether the snake's head or tail cells intersect with the given coordinates.
     * @param x The x coordinate
     * @param y The y coordinate
     */
    isAtCoordinates(x: number, y: number): boolean {
        if (this.head.isAt(x, y)) {
            return true;
        } else {
            for (let i: number = 0; i < this.tail.length; i++) {
                if (this.tail[i].isAt(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Sets the direction of the snake. If the snake has already had a direction set before moving, queue the given
     * direction instead.
     * @param direction The direction to set
     */
    setDirection(direction: string) {
        if (this.directionsGiven > 0) {
            this.queuedDirection = direction;
        } else {
            this.direction = direction;
        }
        this.directionsGiven++;
    }

    private movePoint(point: Point) {
        switch (this.direction) {
            case "left":
                point.x--;
                break;
            case "right":
                point.x++;
                break;
            case "up":
                point.y--;
                break;
            case "down":
                point.y++;
                break;
            default:
                print("Error: Direction invalid");
                break;
        }
    }
}

export default Snake;