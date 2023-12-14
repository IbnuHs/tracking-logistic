export class HaversineCalculator {
  private static readonly R = 6371;

  static haversineDistance(
    originCoordinate: number[],
    destinationCoordinate: number[],
  ) {
    const dLat = this.degreesToRadian(
      originCoordinate[0] - destinationCoordinate[0],
    );

    const dLon = this.degreesToRadian(
      originCoordinate[1] - destinationCoordinate[1],
    );

    const haversine =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadian(originCoordinate[0])) *
        Math.cos(this.degreesToRadian(destinationCoordinate[0])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const toKilometer =
      2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    const distance = this.R * toKilometer;

    return distance;
  }

  private static degreesToRadian(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
