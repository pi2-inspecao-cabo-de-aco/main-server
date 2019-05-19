import sys
import numpy as np
from PIL import Image
import glob

arguments = sys.argv
# remove script name from args
arguments.pop(0)
# get folder name and remove it from args
image_folder = arguments[0]

cam_images = glob.glob(image_folder + '/*.png')
cam_images = filter(lambda img: not 'merged-image' in img, cam_images)
images = list(map(Image.open, cam_images))
# pick the image which is the smallest, and resize the others to match it (can be arbitrary image shape here)
min_shape = sorted( [(np.sum(i.size), i.size ) for i in images])[0][1]

# create top images, e. q. first and second images, joined horizontally
top_imgs = np.hstack( tuple((np.asarray( i.resize(min_shape) ) for i in images[:2] ) ))
# create bottom images, e. q. third and fourth images, joined horizontally
bottom_imgs = np.hstack( tuple((np.asarray( i.resize(min_shape) ) for i in images[2:] ) ))

# combine top and bottom images vertically, to create square images of joined cable images
imgs_comb = np.vstack([top_imgs, bottom_imgs])

# save that beautiful picture
imgs_comb = Image.fromarray(imgs_comb)
final_image = image_folder + '/merged-image.png'
imgs_comb.save(final_image)
print(final_image)

sys.stdout.flush()
