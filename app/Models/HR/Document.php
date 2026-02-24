<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'hr_documents';
    protected $fillable = ['employee_id', 'name', 'type', 'file_path', 'expiry_date'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
