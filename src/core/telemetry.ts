import * as vscode from 'vscode';
import TelemetryReporter from 'vscode-extension-telemetry';

export class Telemetry {
  private reporter: TelemetryReporter;
  
  constructor() {
    this.reporter = new TelemetryReporter(
      'comment-remover',
      vscode.extensions.getExtension('akshatsinha0.comment-remover')?.packageJSON.version || '0.0.0',
      'YOUR_APPLICATION_INSIGHTS_KEY'
    );
  }

  public logEvent(action: string): void {
    this.reporter.sendTelemetryEvent(action);
  }

  public logError(error: Error): void {
    this.reporter.sendTelemetryException(error);
  }

  public dispose(): void {
    this.reporter.dispose();
  }
}
