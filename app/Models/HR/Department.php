<?php 

namespace App\Models\HR; 

use Illuminate\Database\Eloquent\Model; 

class Department extends Model 
{
    protected $table = 'hr_departments'; 
    protected $fillable = ['clinic_id', 'name', 'description']; 

    public function employees() 
    { 
        return $this->hasMany(Employee::class, 'department_id'); 
    } 

    public function designations()
    {
        return $this->hasMany(Designation::class, 'department_id');
    }
}
