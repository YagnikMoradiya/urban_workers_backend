/**
 * Class representing an API Resonse.
 */
class APIResponse {
  data: any;
  message: string;
  status: number;
  error: any;
  
  constructor(data:any = null, message: string = '', status: number = 200, error: any = null) {
    if (data) {
      this.data = data;
    }
    
    if (message) {
      this.message = message;
    }

    if (status) {
      this.status = status;
    }

    if (error) {
      this.error = error;
    }
  }
}

export default APIResponse;
