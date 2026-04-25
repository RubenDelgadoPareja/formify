export abstract class BaseViewModel {
  /**
   * Lifecycle hook called when the View mounts.
   * Override to load initial data, set up subscriptions, etc.
   */
  didMount(): Promise<void> | void {}

  /**
   * Lifecycle hook called when the View unmounts.
   * Override to clean up resources, subscriptions, timers, etc.
   */
  willUnmount(): void {}
}
