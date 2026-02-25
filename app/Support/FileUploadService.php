<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Max file size in KB (10MB).
     */
    protected int $maxFileSizeKb = 10240;

    /**
     * Upload one or more files and attach to an owner model via a relation.
     *
     * @param  Request  $request
     * @param  string  $storagePath  Path under the disk (e.g. 'deals/1', 'proposals/2')
     * @param  Model  $owner  Model that has a files() relation
     * @param  string  $relation  Relation name (e.g. 'files')
     * @param  array  $extra  Extra attributes for each file record (e.g. ['clinic_id' => 1])
     * @param  string  $disk  Storage disk name
     * @return int Number of files uploaded
     */
    public function upload(
        Request $request,
        string $storagePath,
        Model $owner,
        string $relation = 'files',
        array $extra = [],
        string $disk = 'public'
    ): int {
        if ($request->hasFile('files')) {
            $request->validate([
                'files' => 'required|array',
                'files.*' => 'file|max:' . $this->maxFileSizeKb,
            ]);
            $uploadedFiles = $request->file('files');
        } else {
            $request->validate([
                'file' => 'required|file|max:' . $this->maxFileSizeKb,
            ]);
            $uploadedFiles = [$request->file('file')];
        }

        $count = 0;
        foreach ($uploadedFiles as $file) {
            if (!$file) {
                continue;
            }
            $path = $file->store($storagePath, $disk);
            $owner->$relation()->create(array_merge([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'type' => $file->getClientOriginalExtension(),
            ], $extra));
            $count++;
        }

        return $count;
    }

    /**
     * Delete a file model and its stored file.
     *
     * @param  Model  $file  File model (must have 'path' attribute)
     * @param  string  $disk  Storage disk name
     * @return void
     */
    public function deleteFile(Model $file, string $disk = 'public'): void
    {
        if ($file->path) {
            Storage::disk($disk)->delete($file->path);
        }
        $file->delete();
    }
}
