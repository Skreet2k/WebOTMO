import * as _ from "lodash";

export class MathUtil {
    public static areEqual(a: number, b: number, epsilon: number): boolean {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return Math.abs(a - b) < epsilon;
    }

    public static isGreaterThan(a: number, b: number, epsilon: number): boolean {
        if (a == null || b == null) {
            return false;
        }
        return (a > b) && !this.areEqual(a, b, epsilon);
    }

    public static isLessThan(a: number, b: number, epsilon: number): boolean {
        if (a == null || b == null) {
            return false;
        }
        return (a < b) && !this.areEqual(a, b, epsilon);
    }

    public static isGreaterThanOrEqual(a: number, b: number, epsilon: number): boolean {
        if (a == null || b == null) {
            return false;
        }
        return (a > b) || this.areEqual(a, b, epsilon);
    }

    public static isLessThanOrEqual(a: number, b: number, epsilon: number): boolean {
        if (a == null || b == null) {
            return false;
        }
        return (a < b) || this.areEqual(a, b, epsilon);
    }

    public static newGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public static getNextNotExistingId(...args): number {
        /// <summary>Extracts values of 'id' properties of the provided array(s)
        /// and finds and returns the smallest integer value that is not present.</summary>
        var currentIds = {};
        _.forEach(args, (arg) => {
            _.forEach(arg, (item) => {
                currentIds[item['id']] = 1;
            });
        });
        for (var i = 0; i < Number.MAX_VALUE; i++) {
            if (!currentIds[i]) {
                return i;
            }
        }
        throw new Error('Failed to create unique id.');
    }

    public static toDecimalPlaces(value: number, decimalPlaces: number, epsilon: number): number {
        var multiplier = Math.pow(10, decimalPlaces);
        if (value > 0) {
            return Math.floor((value + epsilon) * multiplier) / multiplier;
        }
        return -1 * (Math.round((Math.abs(value) + epsilon) * multiplier) / multiplier);
    }

    public static maxExcludeNull(...values: number[]): number {
        var items = _.filter(values, (arg) => arg != null);
        return items.length > 0 ? Math.max.apply(this, items) : null;
    }

    public static minExcludeNull(...values: number[]): number {
        var items = _.filter(values, (arg) => arg != null);
        return items.length > 0 ? Math.min.apply(this, items) : null;
    }

    public static max(epsilon: number, ...values: number[]): number {
        if (!values.length) {
            return undefined;
        }
        var max = values[0];
        for (var i = 1; i < values.length; ++i) {
            if (MathUtil.isGreaterThan(values[i], max, epsilon)) {
                max = values[i];
            }
        }
        return max;
    }

    public static min(epsilon: number, ...values: number[]): number {
        if (!values.length) {
            return undefined;
        }
        var min = values[0];
        for (var i = 1; i < values.length; ++i) {
            if (MathUtil.isLessThan(values[i], min, epsilon)) {
                min = values[i];
            }
        }
        return min;
    }
}
