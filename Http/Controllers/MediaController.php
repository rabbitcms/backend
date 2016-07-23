<?php

namespace RabbitCMS\Backend\Http\Controllers;

use DtKt\Models\Media as MediaModel;
use Illuminate\Routing\Controller as LaravelController;
use Illuminate\Routing\Route;

class MediaController extends LaravelController
{
    public function image(Route $route)
    {
        /**
         * @var $media MediaModel
         */
        $media = MediaModel::query()
            ->find($route->parameter('id'));

        $filename = public_path($media->path());

        \File::makeDirectory(dirname($filename), 0777, true, true);
        file_put_contents($filename, \Storage::disk('local')->get($media->path()));

        return \Redirect::to($media->path());
    }

    public function resize(Route $route)
    {
        /**
         * @var $media MediaModel
         */
        $media = MediaModel::query()
            ->find($route->parameter('id'));

        $path = storage_path('app/'.$media->path());
        $url = $media->url($route->parameter('width'), $route->parameter('height'), $route->parameter('type'));
        $filename = public_path($url);
        is_file($filename) && unlink($filename);
        $width = $route->parameter('width') == '-' ? null : $route->parameter('width');
        $height = $route->parameter('height') == '-' ? null : $route->parameter('height');

        $img = \Image::make($path);
        $aspectRatio = $img->width() / $img->height();
        $nwidth = $width;
        $nheight = $height;
        switch ($route->parameter('type')) {
            case 'c':
                if ($width !== null || $height !== null) {
                    if ($width === null) {
                        $aspect = intval($height * $aspectRatio) / $height;
                        $nwidth = $img->width();
                    } else {
                        if ($height === null) {
                            $aspect = $width / intval($width / $aspectRatio);
                            $nheight = $img->height();
                        } else {
                            $aspect = $width / $height;
                        }
                    }

                    if ($width !== null && $height !== null) {
                        if ($aspect < $aspectRatio) {
                            $img->resize(
                                null,
                                $height,
                                function ($constraint) {
                                    $constraint->aspectRatio();
                                }
                            );
                        } else {
                            $img->resize(
                                $width,
                                null,
                                function ($constraint) {
                                    $constraint->aspectRatio();
                                }
                            );
                        }
                    }
                    $img->crop($nwidth, $nheight);
                }
                break;
            case 'r':
                if ($width !== null || $height !== null) {
                    $img->resize(
                        $width,
                        $height,
                        function ($constraint) {
                            $constraint->aspectRatio();
                        }
                    );
                }
                break;
        }
        \File::makeDirectory(dirname($filename), 0777, true, true);

        $img->save($filename, 80);

        return \Redirect::to($url);
    }
}
